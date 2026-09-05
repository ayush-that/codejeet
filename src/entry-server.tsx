import { createHandler, StartServer, type DocumentComponentProps } from "@solidjs/start/server";

function Document(props: DocumentComponentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {props.assets}
      </head>
      <body>
        {props.children}
        {props.scripts}
      </body>
    </html>
  );
}

export default createHandler(() => <StartServer document={Document} />, { mode: "async" });
