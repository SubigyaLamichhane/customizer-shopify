import { Page, Layout } from "@shopify/polaris";
import createApp, { Provider, ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

export default function Products(props) {
  const API_URL = props.API_URL;
  const fetch = useAuthenticatedFetch();
  const [loadingStatus, setLoadingStatus] = useState();
  const [toastMsg, setToastMsg] = useState()
  // product selection code
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const hideResourcePicker = () => setOpenResourcePicker(false);
  const showResourcePicker = () => setOpenResourcePicker(true);

  const selectedProduct = (selectPayload) => {
    const prodData = selectPayload.selection;
    var data = [];
    prodData.forEach((product, key) => {
      var prd_image = "";
      if (product.images !== undefined) {
        if (typeof (product.images) === "string") {
          prd_image = product.images;
        } else if (typeof (product.images) === "object" && product.images !== null && product.images.length > 0) {
          prd_image = product.images[0].originalSrc;
        }
        else {
          prd_image = dummyImage;
        }
      }
      data[key] = {
        "product_id": Number(product.id.replace("gid://shopify/Product/", "")),
        "product_title": product.title,
        "product_image": prd_image,
        "product_color": product.options[0].values
      };
    });
    // const productsData["product"] = JSON.stringify(data);
    const response = fetch(`${API_URL}/add-product`, {
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      dataType: "json",
      body: JSON.stringify(data)
    });
    hideResourcePicker();
    console.log('data', data)
  }
  return (
    <Page>
      <TitleBar
        title="Product"
        primaryAction={{
          content: "Add Product",
          onAction: showResourcePicker
          // onAction: () => { setOpenResourcePicker(true) }
        }}
      />
      <Layout>
        <Layout.Section>
          <h1>Hello</h1>
          <ResourcePicker
            resourceType="Product"
            open={openResourcePicker}
            onCancel={hideResourcePicker}
            allowMultiple={true}
            actionVerb="select"
            showVariants={false}
            onSelection={selectedProduct}
            // selectMultiple={false}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
