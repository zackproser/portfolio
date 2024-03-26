'use client'

import React, { useState } from 'react';
import { Container } from '@/components/Container'

const generateNamespace = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let namespace = '';
  for (let i = 0; i < 10; i++) {
    namespace += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${namespace}-${String(new Date().getTime())}`;
}

interface SectionProps {
  selectedPhrases: string[];
  setSelectedPhrases: (phrases: string[]) => void;
  metadata: { [key: string]: string };
  setMetadata: (metadata: { [key: string]: string }) => void;
  handleUpsertVectors: (vectorsToUpsert: any[]) => Promise<void>;
}


interface Section {
  title: string;
  loading: boolean;
  content: (props: SectionProps) => React.ReactNode;
  action?: (data: any) => void;
}

const Demo = () => {
  const [expandedSection, setExpandedSection] = useState(0);
  const [indexName, setIndexName] = useState('vector-database-demo');
  const [namespace, setNamespace] = useState(generateNamespace());
  const [upsertingVectors, setUpsertingVectors] = useState(false);
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<{ [key: string]: string }>({});

  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Step 1: Create an Index',
      loading: false,
      content: () => (
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
      content: () => (
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
      title: 'Step 3: Add Vectors',
      loading: false,
      content: ({ selectedPhrases, setSelectedPhrases, metadata, setMetadata, handleUpsertVectors }) => {
        const phrases = [
          {
            text: 'The quick brown fox jumps over the lazy dog',
            vectors: [0.1, 0.2, 0.3],
          },
          {
            text: 'To be or not to be, that is the question',
            vectors: [0.1, 0.2, 0.3],
          },
          {
            text: 'A picture is worth a thousand words',
            vectors: [0.1, 0.2, 0.3],
          },
        ];

        const handlePhraseSelection = (phrase: string) => {
          if (selectedPhrases.includes(phrase)) {
            setSelectedPhrases(selectedPhrases.filter((p: string) => p !== phrase));
          } else {
            setSelectedPhrases([...selectedPhrases, phrase]);
          }
        };

        const handleMetadataChange = (key: string, value: string) => {
          setMetadata((prevMetadata) => ({
            ...prevMetadata,
            [key]: value,
          }));
        };

        const handleMetadataDelete = (key: string) => {
          setMetadata((prevMetadata) => {
            const { [key]: _, ...rest } = prevMetadata;
            return rest;
          });
        };

        const handleAddMetadata = () => {
          if (metadata.key && metadata.value) {
            setMetadata((prevMetadata) => ({
              ...prevMetadata,
              [metadata.key]: metadata.value,
              key: '',
              value: '',
            }));
          }
        };

        const handleAddVectorsClick = () => {
          const vectorsToUpsert = phrases
            .filter((phrase) => selectedPhrases.includes(phrase.text))
            .map((phrase) => ({
              vectors: phrase.vectors,
              metadata: metadata,
            }));

          handleUpsertVectors(vectorsToUpsert);
        };

        return (
          <div className="p-4 text-gray-300">
            <p className="mb-4">
              This section allows you to add vectors to your index by selecting phrases and optionally adding metadata.
              Each phrase has an associated set of vectors generated by an embedding model that extracts features from the text.
            </p>
            <div className="space-y-6 mb-6">
              {phrases.map((phrase, index) => (
                <div
                  key={index}
                  className={`border rounded-md p-4 ${selectedPhrases.includes(phrase.text)
                    ? 'bg-green-800 border-green-600 text-white'
                    : 'border-gray-700'
                    }`}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={selectedPhrases.includes(phrase.text)}
                      onChange={() => handlePhraseSelection(phrase.text)}
                    />
                    <span className="ml-2 text-lg">{phrase.text}</span>
                  </label>
                  <div className="mt-2 max-h-40 overflow-auto">
                    <pre className="text-sm text-gray-500">{JSON.stringify(phrase.vectors, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Metadata (Optional)</h3>
              <p className="text-sm text-gray-400 mb-2">
                Metadata allows you to associate additional information with your vectors, enabling more precise querying, filtering, and categorization based on specific attributes or properties. By attaching relevant metadata to your vectors, you can enhance the functionality and usefulness of your vector database, making it easier to retrieve and work with specific subsets of vectors that match certain criteria.
              </p>
              <div className="space-y-2">
                {Object.entries(metadata).map(([key, value]) => (
                  key !== 'key' && key !== 'value' && (
                    <div key={key} className="flex items-center mb-2">
                      <input
                        type="text"
                        className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={key}
                        onChange={(e) => handleMetadataChange(e.target.value, value)}
                      />
                      <span className="mx-2">:</span>
                      <input
                        type="text"
                        className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={value}
                        onChange={(e) => handleMetadataChange(key, e.target.value)}
                      />
                      <button
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                        onClick={() => handleMetadataDelete(key)}
                      >
                        Delete
                      </button>
                    </div>
                  )
                ))}
                <div className="flex items-center">
                  <input
                    type="text"
                    className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Key"
                    value={metadata.key || ''}
                    onChange={(e) => handleMetadataChange('key', e.target.value)}
                  />
                  <span className="mx-2">:</span>
                  <input
                    type="text"
                    className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Value"
                    value={metadata.value || ''}
                    onChange={(e) => handleMetadataChange('value', e.target.value)}
                  />
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                    onClick={handleAddMetadata}
                  >
                    Add
                  </button>
                </div>
              </div>
              {Object.keys(metadata).filter((key) => key !== 'key' && key !== 'value').length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Metadata Preview</h4>
                  <pre className="text-sm text-gray-500">
                    {JSON.stringify(
                      Object.entries(metadata)
                        .filter(([key]) => key !== 'key' && key !== 'value')
                        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              onClick={handleAddVectorsClick}
            >
              {sections[2].loading ? (
                <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
                  {/* Loading spinner SVG */}
                </svg>
              ) : (
                'Add Vectors'
              )}
            </button>
          </div>
        );
      },
    },
    {
      title: 'Query',
      loading: false,
      content: () => (
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
      content: () => (
        <div className="p-4 text-gray-300">
          <p className="mb-4">
            In this section, you can clean up the demo by deleting the namespace you created.
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
              'Delete Namespace'
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

  const handleUpsertVectors = async (vectorsToUpsert: any[]) => {
    console.log(`handleUpsertVectors: ${namespace}`);
    setUpsertingVectors(true);

    try {
      const response = await fetch('/api/pineconenamespaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vectorsToUpsert,
        }),
      });

      if (response.ok) {
        handleSectionCompletion(3);
      } else {
        console.error('Error upserting vectors:', response.statusText);
      }
    } catch (error) {
      console.error('Error upserting vectors:', error);
    } finally {
      setUpsertingVectors(false);
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
      <div className="bg-gray-800 shadow-md rounded-lg mx-auto">
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
            {expandedSection === index && (
              <div>
                {section.content({
                  selectedPhrases,
                  setSelectedPhrases,
                  metadata,
                  setMetadata,
                  handleUpsertVectors,
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Demo;
