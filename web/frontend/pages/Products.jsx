import {
  Frame,
  Page,
  Layout,
  LegacyCard,
  Filters,
  DataTable,
  Thumbnail,
  Button,
  Toast,
  Spinner,
  Icon
} from "@shopify/polaris";
import createApp, { Provider, ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import ReactPaginate from "react-paginate";
import { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import dummyImage from "../assets/images/dummy-image.jpg";
import { useNavigate } from "react-router-dom";
import { CircleTickMinor, MobileAcceptMajor, CancelMajor } from '@shopify/polaris-icons';

export default function Products(props) {
  const API_URL = props.API_URL;
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [toastMsg, setToastMsg] = useState();
  const [toastContent, setToastContent] = useState("");
  const [toastErrStatus, setToastErrStatus] = useState(false);

  // product selection variables
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const hideResourcePicker = () => setOpenResourcePicker(false);
  const showResourcePicker = () => setOpenResourcePicker(true);

  const [rows, setRows] = useState([]);
  const [rowUpdate, setRowUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  useEffect(async () => {
    const response = await fetch(`${API_URL}/get-product-list`);
    const productList = await response.json();
    setRows(productList.data);
    setLoadingStatus(false);
  }, [rowUpdate]);

  var selectedPrdIds = [];
  var checkSelectedProdIds = [];
  var allProductData = rows?.filter((product) => {
    if (searchTerm == "") {
      return product;
    } else if (product.title?.toLowerCase().includes(searchTerm?.toLowerCase())) {
      return product;
    }
  }).map(product => {
    selectedPrdIds.push({
      id: `gid://shopify/Product/${product.product_id}`,
    });
    checkSelectedProdIds.push(product.product_id)
    return (
      [<Thumbnail
        source={product.image}
        alt={product.title}
      />,
      `${product.title}`,
      (product.is_mapped === 1) ?
        <p style={{ marginLeft: "-145px" }}>
          <Icon
            source={MobileAcceptMajor}
            color="success"
          />
        </p>
        :
        <p style={{ marginLeft: "-145px" }}>
          <Icon
            source={CancelMajor}
            color="critical"
          />
        </p>,
      <a href={void 0} style={{ marginLeft: "8px" }}><Button primary id={product.id} onClick={() => navigate(`/ProductMap/?id=${product.id}`)}>Mark Region </Button></a>
      ]
    )
  }).reverse();

  var pageCount = 0;
  var allProductTableData = [];
  if (allProductData) {
    pageCount = Math.ceil(allProductData.length / usersPerPage);
    allProductTableData = allProductData.slice(pagesVisited, pagesVisited + usersPerPage);
  }

  // filter code
  const [queryValue, setQueryValue] = useState("");
  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value);
      setSearchTerm(value);
      setPageNumber(0)
    },
    [],
  );
  const handleQueryValueRemove = useCallback(() => { setQueryValue(""); setSearchTerm(""); }, []);
  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const filters = [];
  const appliedFilters = [];
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    if (pageNumber === 0) {
      setDataCount(allProductData.length);
    } else {
      setDataCount((usersPerPage * pageNumber) + allProductData.length);
    }
  }, [rows, pageNumber, searchTerm]);
  // filter code end

  // product selection code function
  const selectedProduct = async (selectPayload) => {
    const prodData = selectPayload.selection;
    var data = {
      'products': []
    };
    console.log('checkSelectedProdIds', checkSelectedProdIds)
    let prodIndex = 0;
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
      let prodId = Number(product.id.replace("gid://shopify/Product/", ""));
      console.log('checkSelectedProdIds.length > 0', checkSelectedProdIds.length > 0, 'checkSelectedProdIds.includes(prodId) == false', checkSelectedProdIds.includes(prodId) == false)
      if (checkSelectedProdIds.length > 0) {
        if (checkSelectedProdIds.includes(prodId) == false) {
          console.log('if')
          data['products'][prodIndex] = {
            "product_id": prodId,
            "product_title": product.title,
            "product_image": prd_image,
            "product_color": product.options[0].values
          };
          prodIndex += 1;
        }
      } else {
        console.log('else')
        data['products'][key] = {
          "product_id": prodId,
          "product_title": product.title,
          "product_image": prd_image,
          "product_color": product.options[0].values
        };
        prodIndex += 1;
      }
    });
    console.log('data', data)
    if (data.products.length > 0) {
      const response = await fetch(`${API_URL}/add-product`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resultData = await response.json();

      if (resultData.status === true) {
        setToastContent(resultData.message);
        setToastMsg(true);
        setLoadingStatus(false);
        setRowUpdate(!rowUpdate);
      }
      else {
        setToastContent("Something went wrong!");
        setToastErrStatus(true)
      }
      setOpenResourcePicker(false);
      console.log('response', resultData)
    } else {
      console.log('data.products.length', data.products.length)
      setOpenResourcePicker(false);
    }
    // hideResourcePicker();
  }

  return (
    <Frame>
      <Page fullWidth>
        {toastMsg &&
          <Toast content={toastContent} onDismiss={() => setToastMsg(false)} />
        }
        {toastErrStatus &&
          <Toast content={toastContent} error onDismiss={() => setToastErrStatus(false)} />
        }
        {loadingStatus &&
          <div className="loader_wrapper">
            <div className="spinner_loader">
              <Spinner accessibilityLabel="Spinner" size="large" />
            </div>
          </div>
        }
        <div className="header">
          <div className="header_title">
            <h1 className='Polaris-Heading'>List Of Product</h1>
          </div>
          <div className="header_btns">
            <a href={void 0} onClick={showResourcePicker} style={{ marginLeft: "8px" }}>
              <Button primary>
                Add Product
              </Button>
            </a>
          </div>
        </div>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <ResourcePicker
                resourceType="Product"
                open={openResourcePicker}
                onCancel={hideResourcePicker}
                initialSelectionIds={selectedPrdIds}
                allowMultiple={true}
                actionVerb="select"
                showVariants={false}
                onSelection={selectedProduct}
              // selectMultiple={false}
              />
              <div className="filter_wrapper">
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleFiltersClearAll}
                  queryPlaceholder="Search here"
                />
              </div>
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'action',
                ]}
                headings={[
                  <h1 className='Polaris-Heading'>Image</h1>,
                  <h1 className='Polaris-Heading'>Title</h1>,
                  <h1 className='Polaris-Heading'>Is Mark</h1>,
                  <h1 className='Polaris-Heading'>Action</h1>
                ]}
                rows={allProductTableData}
                footerContent={`Showing ${dataCount} of ${allProductData ? allProductData.length : "0"} results`}
              />
              <ReactPaginate
                previousLabel={<svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414l-4.293 4.293 4.293 4.293a.999.999 0 0 1-.707 1.707z"></path></svg>}
                nextLabel={<svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M8 16a.999.999 0 0 1-.707-1.707l4.293-4.293-4.293-4.293a.999.999 0 1 1 1.414-1.414l5 5a.999.999 0 0 1 0 1.414l-5 5a.997.997 0 0 1-.707.293z"></path></svg>}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
                forcePage={pageNumber}
              />
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}
