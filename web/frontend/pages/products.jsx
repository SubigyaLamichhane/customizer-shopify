import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function Products() {
  return (
    <Page>
      <TitleBar
        title="Product"
        primaryAction={{
          content: "Add Product",
          onAction: () => console.log("Primary action"),
        }}
      />
      <Layout>
        <Layout.Section>
            <h1>This is product page</h1>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
