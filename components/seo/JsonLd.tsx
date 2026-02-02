/**
 * JSON-LD Script Component
 * Renders structured data for search engines
 */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}

/**
 * Multiple JSON-LD schemas component
 */
interface MultiJsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemas: Record<string, any>[];
}

export function MultiJsonLd({ schemas }: MultiJsonLdProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
    </>
  );
}
