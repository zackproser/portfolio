const fs = require('fs');
const path = require('path');
const { Handlebars } = require('handlebars');
const { format } = require('date-fns');

interface NewsletterData {
  date: string;
  title: string;
  description: string;
  headlines: string;
}

function createNewsletterDraft(): void {
  const inputData = fs.readFileSync(0, 'utf-8');
  const data: NewsletterData = JSON.parse(inputData);

  const templatePath = path.join(__dirname, 'newsletter-template.md');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = Handlebars.compile(template);

  const formattedDate = format(new Date(), 'yyyy-MM-dd');
  const renderedContent = compiledTemplate({
    ...data,
    date: formattedDate,
  });

  const outputPath = path.join(__dirname, '..', '..', 'content', 'newsletter', `${formattedDate}-newsletter-draft.md`);
  fs.writeFileSync(outputPath, renderedContent);
}

createNewsletterDraft();
