import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/Container';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDatabase, getCategories, getFeatures } from '../../../../lib/getDatabases';
import { getEmoji } from '../../../../lib/emojiMapping';
import { getLogoById } from '../../../../lib/logoImports';


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
                : (typeof value === 'string' ? `${value} ${getEmoji(value)}` : value.toString())}
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

  return (
    <Container>
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
      {Object.entries(database).map(([key, value]) => {
        if (typeof value === 'object' && value !== null && key !== 'specific_details') {
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
    </Container>
  );
}
