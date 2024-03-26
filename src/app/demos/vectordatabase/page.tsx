'use client'

import React, { useState } from 'react';
import { Container } from '@/components/Container'

const generateNamespace = () => {
  // Generate a random index name
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let indexName = '';
  for (let i = 0; i < 10; i++) {
    indexName += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // Append the timestamp to the index name
  return `${indexName}-${String(new Date().getTime())}`;
}

interface Section {
  title: string;
  loading: boolean;
  content: (sections: Section[]) => React.ReactNode;
  action?: (data: any) => void;
}

const Demo = () => {
  const [expandedSection, setExpandedSection] = useState(0);
  const [indexName, setIndexName] = useState('vector-database-demo');
  const [namespace, setNamespace] = useState(generateNamespace());
  const [upsertingVectors, setUpsertingVectors] = useState(false);
  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Step 1: Create an Index',
      loading: false,
      content: (sections) => (
        <div className="p-4 text-gray-300">
          <p className="mb-4">
            An index is a data structure that enables efficient search and retrieval of vectors. Normally, you'd create your own index, but for the purposes of this demo,
            the index has already been created. In the next step, we'll create a namespace within this index that is unique to you.
          </p>

          <p className="mb-4 mt-6">
            Vector indexing is a core concept in vector databases. Indexes are a data structure that enable fast retrieval of vectors over large datasets. By creating an index, you can quickly search for similar vectors in the database.
          </p>
          <p className="mb-4 mt-6">You can also use indexes as an organizational tool, by creating a new index for each of your use cases or apps.</p>

          <label className="block mt-4">Demo Index</label>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 mt-4"
            placeholder={indexName}
            disabled={true}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handleCreateIndex}
            disabled={sections[0].loading}
          >
            {sections[0].loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 inline"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg><span>Creating Namespace...</span>
              </>
            ) : (
              'Got it - proceed to create a namespace'
            )}
          </button>
        </div>
      ),
    },
    {
      title: 'Step 2: Create a Namespace',
      loading: false,
      content: (sections) => (
        <div className="p-4 text-gray-300">
          <p className="mb-4">
            In this section, you will create a new namespace within your index. A namespace is like a partition or divider - it's suitable for organizing vectors by use case or app, and for implementing multi-tenancy,
            where each organization or user gets their own namespace. The namespace you can create for this demo has been pre-populated for you.
          </p>

          <p className="mb-4">
            All of the vectors you upsert in the next step will go into your namespace.
          </p>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handleCreateNamespace}
            disabled={false}
          >
            Create Namespace
          </button>

          <input
            type="text"
            className="border border-gray-300 rounded p-2 mt-4 ml-8"
            placeholder={namespace}
            disabled={true}
          />
        </div>
      ),
    },
    {
      title: 'Add Vectors',
      loading: false,
      content: (sections) => {
        const phrases = [
          {
            text: 'The quick brown fox jumps over the lazy dog',
            vectors: [{
              "embeddings": [
                0.01, 0.2, 0.3
              ]
            }],
          },
          {
            text: 'To be or not to be, that is the question',
            vectors: [
              0.01, 0.2, 0.3
            ],
          },
          {
            text: 'A picture is worth a thousand words',
            vectors: [
              0.01, 0.2, 0.3
            ],
          },
        ];
        return (
          <div className="p-4 text-gray-300">
            <p className="mb-4">
              In this section, you can add vectors to your index by clicking on the buttons below.
              Each button corresponds to a well-known phrase, and the associated vectors will be
              upserted to your index.
            </p>
            <div className="space-y-4">
              {phrases.map((phrase, index) => (
                <button
                  key={index}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded block w-full"
                  onClick={() => handleUpsertVectors(phrase.vectors)}
                  disabled={sections[1].loading}
                >
                  {sections[1].loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 inline"
                      viewBox="0 0 24 24"
                    >
                      {/* Loading spinner SVG */}
                    </svg>
                  ) : (
                    phrase.text
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Metadata',
      loading: false,
      content: (sections, handleCreateIndex) => (
        <div className="p-4 text-gray-300">
          <p className="mb-4">
            In this section, you will add metadata to the vectors. Metadata allows you to associate
            additional information with the vectors for querying purposes.
          </p>
          {/* Add form or input fields for adding metadata */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleSectionCompletion(3)}
            disabled={sections[2].loading}
          >
            {sections[2].loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 inline"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Add Metadata'
            )}
          </button>
        </div>
      ),
    },
    {
      title: 'Query',
      loading: false,
      content: (sections, handleCreateIndex) => (
        <div className="p-4 text-gray-300">
          <p className="mb-4">
            In this section, you can perform a similarity search on the index. Enter a query phrase
            and find the most similar vectors based on semantic meaning.
          </p>
          {/* Add form or input fields for querying the index */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleSectionCompletion(4)}
            disabled={sections[3].loading}
          >
            {sections[3].loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 inline"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Search'
            )}
          </button>
        </div>
      ),
    },
    {
      title: 'Clean Up',
      loading: false,
      content: (sections, handleCreateIndex) => (
        <div className="p-4 text-gray-300">
          <p className="mb-4">
            In this section, you can clean up the demo by deleting the index you created.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleSectionCompletion(0)}
            disabled={sections[4].loading}
          >
            {sections[4].loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 inline"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Delete Index'
            )}
          </button>
        </div>
      ),
    },
  ]);

  const handleSectionCompletion = (sectionIndex: number) => {
    setExpandedSection(sectionIndex);
  };

  const handleSectionToggle = (sectionIndex: number) => {
    if (expandedSection === sectionIndex) {
      setExpandedSection(0);
    } else {
      setExpandedSection(sectionIndex);
    }
  };

  const handleCreateIndex = () => {
    handleSectionCompletion(1);
  }

  const handleCreateNamespace = () => {
    handleSectionCompletion(2);
  }

  const handleUpsertVectors = async (vectors: number[]) => {
    console.log(`handleUpsertVectors: ${namespace}`);
    setUpsertingVectors(true);

    // Update section 1 to show loading state is true 
    try {
      const response = await fetch('/api/pineconenamespaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vectors,
        }),
      });

      if (response.ok) {
        handleSectionCompletion(1);
      } else {
        console.error('Error creating namespace:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating namespace:', error);
    } finally {
    }
  };

  return (
    <Container className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Vector Database Demo</h1>
      <p className="text-zinc-200 mb-6">
        This interactive demo helps you get familiar with vector database operations: You can create a namespace, populate it with embeddings, attach metadata
        to your embeddings when upserting them, and then issue queries in order to see what results are retrieved.
      </p>
      <p className="text-zinc-200 mb-6">
        It uses Pinecone under the hood for the vector database provider and is a great introduction to working with
        vector databases.
      </p>
      <div className="bg-gray-800 shadow-md rounded-lg max-w-3xl mx-auto">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-gray-700">
            <div
              className={`flex justify-between items-center p-4 cursor-pointer ${expandedSection === index ? 'bg-gray-700' : ''
                }`}
              onClick={() => handleSectionToggle(index)}
            >
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <svg
                className={`w-6 h-6 transform transition-transform text-white ${expandedSection === index ? 'rotate-180' : ''
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expandedSection === index && <div>{section.content(sections)}</div>}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Demo;
