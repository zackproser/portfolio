const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { format } = require('date-fns');
const fs = require('fs');

interface Headline {
  title: string;
  url: string;
  source: string;
}

async function fetchGitHubTrending(): Promise<Headline[]> {
  const apiUrl = 'https://api.github.com/search/repositories';
  const today = format(new Date(), 'yyyy-MM-dd');
  const query = `created:>${today}&sort=stars&order=desc&q=ai+machine+learning`;

  try {
    const response = await axios.get(`${apiUrl}?${query}`);
    const headlines = response.data.items.map((item: any) => ({
      title: item.full_name,
      url: item.html_url,
      source: 'GitHub Trending',
    }));
    return headlines;
  } catch (error) {
    console.error('Error fetching GitHub Trending headlines:', error);
    return [];
  }
}

async function fetchArXivPapers(): Promise<Headline[]> {
  const apiUrl = 'http://export.arxiv.org/api/query';
  const query = 'all:AI+OR+all:machine+learning';
  const maxResults = 10;

  try {
    const response = await axios.get(`${apiUrl}?search_query=${query}&max_results=${maxResults}`);
    const headlines = response.data.entries.map((entry: any) => ({
      title: entry.title,
      url: entry.id,
      source: 'arXiv',
    }));
    return headlines;
  } catch (error) {
    console.error('Error fetching arXiv papers:', error);
    return [];
  }
}

async function fetchRedditPosts(): Promise<Headline[]> {
  const subreddits = ['artificial', 'MachineLearning', 'deeplearning'];
  const apiUrl = 'https://www.reddit.com/r';
  const limit = 10;

  try {
    const headlines: Headline[] = [];
    for (const subreddit of subreddits) {
      const response = await axios.get(`${apiUrl}/${subreddit}/top.json?limit=${limit}`);
      const posts = response.data.data.children.map((child: any) => ({
        title: child.data.title,
        url: `https://www.reddit.com${child.data.permalink}`,
        source: `r/${subreddit}`,
      }));
      headlines.push(...posts);
    }
    return headlines;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
}

async function run(): Promise<void> {
  try {
    // TODO: Re-enable the other data sources once API access is sorted out
    /*const [gitHubHeadlines, arXivHeadlines, redditHeadlines] = await Promise.all([
      fetchGitHubTrending(),
      fetchArXivPapers(),
      fetchRedditPosts(),
    ]);

    const allHeadlines = [...gitHubHeadlines, ...arXivHeadlines, ...redditHeadlines];
    */

    const gitHubHeadlines = await fetchGitHubTrending();

    const allHeadlines = [...gitHubHeadlines];
    core.setOutput('headlines', JSON.stringify(allHeadlines));

    // Save headlines to a file
    const headlinesFile = 'headlines.json';
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(headlinesFile, JSON.stringify(allHeadlines, null, 2), (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    core.setOutput('headlines-file', headlinesFile);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

run();
