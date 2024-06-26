import React from 'react';
import Image from 'next/image';
import { SimpleLayout } from '@/components/SimpleLayout'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { getDatabase, getDatabases, getCategories, getFeatures } from '@/lib/getDatabases';
import { getEmoji } from '@/lib/emojiMapping';
import { getLogoById } from '@/lib/logoImports';
import { createMetadata } from '@/utils/createMetadata';

export const generateMetadata = async ({ params }) => {
  const database = getDatabase(params.name);
  return createMetadata({
    title: `${database.name} - Vector Database Details`,
    description: database.description,
  });
};

export default async function DetailPage({ params }) {
  const database = getDatabase(params.name);
  const categories = getCategories();
  const features = getFeatures();

  if (!database) {
    return <div>Database not found</div>;
  }

  const logoSrc = await getLogoById(database.logoId);

  const renderSection = (title, data) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">{getEmoji(title)} {title}</CardTitle>
        {categories[title] && (
          <>
            <p className="text-gray-600">{categories[title].description}</p>
            <p className="text-sm text-gray-500 mt-2">Why it&apos;s important: {categories[title].importance}</p>
          </>
        )}
      </CardHeader>
      <CardContent>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-4">
            <p className="font-semibold">
              {getEmoji(key)} {key}: {' '}
              {typeof value === 'boolean'
                ? (value ? getEmoji('yes') : getEmoji('no'))
                : (Array.isArray(value) ? value.join(', ') : value.toString())}
            </p>
            {features[key] && (
              <>
                <p className="text-sm text-gray-600 ml-6">{features[key].description}</p>
                <p className="text-xs text-gray-500 ml-6 mt-1">Why it matters: {features[key].importance}</p>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderBusinessInfo = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">{getEmoji('business')} Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {Object.entries(database.business_info).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key.replace('_', ' ')}</TableCell>
                <TableCell>
                  {key === 'funding_rounds' ? (
                    <ul className="list-disc pl-5">
                      {value.map((round, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-semibold">{round.date}:</span> {round.amount} (Series {round.series})
                        </li>
                      ))}
                    </ul>
                  ) : key === 'key_people' ? (
                    <ul className="list-disc pl-5">
                      {value.map((person, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-semibold">{person.name}</span> - {person.position}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    value
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderFeatureComparison = () => {
    const allDatabases = getDatabases();
    const features = getFeatures();
    const featureCategories = getCategories();

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{getEmoji('comparison')} Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deployment">
            <TabsList className="mb-4 flex flex-wrap">
              {Object.keys(featureCategories).map((category) => (
                <TabsTrigger key={category} value={category} className="mb-2">
                  {getEmoji(category)} {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(featureCategories).map(([category, { description, importance }]) => (
              <TabsContent key={category} value={category}>
                <p className="mb-2 text-sm text-gray-600">{description}</p>
                <p className="mb-4 text-xs text-gray-500">Why it's important: {importance}</p>
                {Object.entries(database[category]).map(([feature, value]) => (
                  <div key={feature} className="mb-4">
                    <div className="flex justify-between items-center mb-2 flex-wrap">
                      <span className="font-semibold mr-2 break-all">{getEmoji(feature)} {feature}</span>
                      <Badge variant={value ? "success" : "secondary"}>
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </Badge>
                    </div>
                    {features[feature] && (
                      <>
                        <p className="text-sm text-gray-600">{features[feature].description}</p>
                        <p className="text-xs text-gray-500 mt-1">Why it matters: {features[feature].importance}</p>
                      </>
                    )}
                    <div className="mt-2 flex items-center">
                      <Progress 
                        value={allDatabases.filter(db => db[category][feature]).length / allDatabases.length * 100} 
                        className="flex-grow"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {Math.round(allDatabases.filter(db => db[category][feature]).length / allDatabases.length * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  const renderSDKs = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {database.integration_api.sdks.map(sdk => (
        <Badge key={sdk} variant="outline">
          {sdk}
        </Badge>
      ))}
    </div>
  );

  return (
    <SimpleLayout
      title={`Spotlight on vector database`}
      intro={database.name}
    >
      <div className="mb-8">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt={`${database.name} logo`}
            width={200}
            height={200}
            className="mx-auto"
          />
        )}
        <h1 className="text-3xl font-bold text-center mt-4">{database.name}</h1>
        <p className="text-xl text-gray-600 mt-2 text-center">{database.description}</p>
      </div>

      {renderBusinessInfo()}
      {renderFeatureComparison()}

      {Object.entries(database).map(([key, value]) => {
        if (typeof value === 'object' && value !== null && key !== 'specific_details' && key !== 'business_info') {
          if (key === 'integration_api') {
            return (
              <Card key={key} className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">{getEmoji(key)} {key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Supported SDKs:</p>
                  {renderSDKs()}
                  {renderSection(key, value)}
                </CardContent>
              </Card>
            );
          }
          return renderSection(key, value);
        }
        return null;
      })}

      {database.specific_details && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{getEmoji('additional')} Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(database.specific_details).map(([key, value]) => (
              <p key={key} className="mb-2">
                <span className="font-semibold">{key.replace('_', ' ')}: </span>
                {value}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </SimpleLayout>
  );
}
