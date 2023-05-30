import {
  Frame, Page, Heading, Stack, Grid, Button, TextField, LegacyCard, DropZone,
  LegacyStack,
  Thumbnail,
  Banner,
  List,
  Text,
  Select,
  Spinner,
  Icon,
  Toast,
  Modal,
  TextContainer,
  MediaCard
} from '@shopify/polaris';
import {
  ChevronLeftMinor, CircleTickMinor, MobileAcceptMajor, CancelMajor,
  NoteMinor, AlertMinor
} from '@shopify/polaris-icons';
import { TitleBar } from '@shopify/app-bridge';
import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticatedFetch } from '../hooks';
import ReactCrop from 'react-image-crop'
export default function ProductMap(props) {
  const API_URL = props.API_URL;
  const fetch = useAuthenticatedFetch();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [toastMsg, setToastMsg] = useState();
  const [toastContent, setToastContent] = useState("");
  const [toastErrStatus, setToastErrStatus] = useState(false);
  const [product, setProduct] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get("id");
  const [title, setTitle] = useState("");
  const [lookName, setLookName] = useState('Front');
  const [lookNameError, setLookNameError] = useState(false);
  const [image, setImage] = useState([]);
  const [crop, setCrop] = useState({
    unit: 'px', // Can be 'px' or '%'
    x: 50,
    y: 50,
    width: 100,
    height: 100
  });

   // modal functionality
   const [activePreview, setActivePreview] = useState(false);
   const changePreviewHandle = useCallback(() => setActivePreview(!activePreview), [activePreview]);

  // file upload code
  const [file, setFile] = useState();
  const [fileError, setFileError] = useState("");
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
      if (validImageTypes.includes(acceptedFiles[0].type)) {
        if (acceptedFiles[0].size < 2000000) {
          setFile((file) => acceptedFiles[0]);
          setFileError("");
        } else {
          setFile();
          setFileError(`“${acceptedFiles[0].name}” is too large. Try a file size less than 2MB.`)
        }
      } else {
        setFile();
        setFileError(`“${acceptedFiles[0].name}” is not supported. File type must be .gif, .jpg, .png or .svg.`)
      }
    },
    []
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <div style={{ padding: '0' }}>
      <LegacyStack alignment="center">
        <Thumbnail
          size="small"
          alt={file.name}
          source={
            validImageTypes.includes(file.type)
              ? window.URL.createObjectURL(file)
              : NoteMinor
          }
        />
        <div>
          {file.name}{' '}
          <Text variant="bodySm" as="p">
            {file.size} bytes
          </Text>
        </div>
      </LegacyStack>
    </div>
  );
  // file upload code end

  // handle look name
  const handleLookName = useCallback((newValue) => {
    if (newValue === "") {
      setLookNameError(true);
      setLookName("");
    } else {
      setLookName(newValue);
      setLookNameError(false);
    }
  }, []);

  // get product data
  const getProduct = async () => {
    const response = await fetch(`${API_URL}/get-product/${product_id}`);
    const res = await response.json();
    if (res.status === true) {
      setProduct(res.data[0]);
      setFile();
      setTitle(res.data[0].title);
      setImage(res.data[0].image);
      setLoadingStatus(false);
    }
  }

  // save product mapping
  const saveProductMapping = async () => {
    setLoadingStatus(true);
    if (lookName === "") {
      setLoadingStatus(false);
      setLookNameError(true);
      return false;
    }
    if (!file) {
      setLoadingStatus(false);
      setFileError("File is required!");
      return false;
    }

    let formData = new FormData()
    formData.append('look_name', lookName);
    formData.append('image', file);
    formData.append('crop', JSON.stringify(crop));
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    const response = await fetch(`${API_URL}/map-product/${product_id}`, {
      method: 'POST',
      body: formData,
      config
    });
    const res = await response.json();
    console.log('res', res);
    if (res.status === true) {
      console.log('res', res)
      getProduct();
      setFile();
      setToastContent(res.message);
      setToastMsg(true);
      setLoadingStatus(false);
    }
    else {
      setLoadingStatus(false);
      setToastContent("Something went wrong!");
      setToastErrStatus(true)
    }
  }

  // delete map product
  const deleteProductMap = async (id) => {
    console.log('value', id)
    setLoadingStatus(true);
    const response = await fetch(`${API_URL}/delete-map-product/${id}`, {
      method: "DELETE",
      headers: { 'content-type': 'multipart/form-data' }
    });
    const res = await response.json();
    if (res.status === true) {
      console.log('res', res)
      setToastContent(res.message);
      setToastMsg(true);
      setLoadingStatus(false);
      getProduct();
    }
    else {
      setToastContent("Something went wrong!");
      setToastErrStatus(true);
    }
  }

  // call use effect
  useEffect(async () => {
    getProduct();
  }, []);

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
          <div className="header_link">
            <Link to="/">
              <span><Icon source={ChevronLeftMinor} color="base" /></span>
              <span className="link_text">Go Back</span>
            </Link>
          </div>
          <div className="header_btns">
            <a href={void 0} onClick={changePreviewHandle} style={{ marginLeft: "8px" }}>
              <Button>
                Instruction
              </Button>
            </a>
            <a href={void 0} onClick={saveProductMapping} style={{ marginLeft: "8px" }}>
              <Button primary>
                Add More Looks
              </Button>
            </a>
          </div>
        </div>
        <LegacyCard sectioned>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <LegacyCard title={title} sectioned>
                <LegacyCard title="More Looks" sectioned>
                  <TextField
                    label="Look name"
                    value={lookName}
                    placeholder='Please enter value'
                    onChange={handleLookName}
                    autoComplete="off"
                    error={lookNameError && "Can not be empty!"}
                  /><br />
                  <LegacyStack vertical>
                    <DropZone allowMultiple={false} label="Choose File for image" onDrop={handleDropZoneDrop}>
                      {uploadedFile}
                      {fileUpload}
                      {fileError &&
                        <div id="PolarisTextField11Error" className="Polaris-InlineError">
                          <div className="Polaris-InlineError__Icon">
                            <Icon source={AlertMinor} />
                          </div>
                          {fileError}
                        </div>
                      }
                    </DropZone>
                  </LegacyStack>
                </LegacyCard>
              </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <LegacyCard sectioned>
                <div className="product_img">
                  <ReactCrop crop={crop} onChange={c => { setCrop(c); console.log('crop', crop) }}>
                    <img style={{ transform: `scale(1) rotate(0deg)` }} src={file ? window.URL.createObjectURL(file) : image} alt={title} />
                  </ReactCrop>
                </div>
              </LegacyCard>
            </Grid.Cell>
          </Grid>
        </LegacyCard>
        <LegacyCard title="Map Product List" sectioned>
          {/* foreach for product mapping */}
          {
            product.product_map?.map((product, i) => {
              return (
                [
                  <MediaCard
                    key={i}
                    title="Look Name"
                    description={product.look_name}
                    popoverActions={[{ content: 'Delete', onAction: () => { deleteProductMap(product.id) } }]}
                  >
                    <div className="product_img">
                      <ReactCrop crop={JSON.parse(product.crop)}>
                        <img
                          alt=""
                          style={{
                            transform: 'scale(1) rotate(0deg)',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            cursor: 'not-allowed'
                          }}
                          src={product.image}
                        />
                      </ReactCrop>
                    </div>
                  </MediaCard>
                ]
              )
            }).reverse()
          }
        </LegacyCard>
        {/* end foreach for product mapping */}

        {/* modal start */}
        <div >
          <Modal
            open={activePreview}
            onClose={changePreviewHandle}
            title="Instruction"
            secondaryActions={{
              content: 'Close',
              onAction: changePreviewHandle,
            }}
          >
            <Modal.Section>
              <TextContainer>
                <ol>
                  <li>Click Drawing and then add a line or shape.</li>
                  <li>Click where to start drawing.</li>
                  <li>Click each corner or bend of your line or shape to move the map, click and hold the mouse.</li>
                  <li>When you're finished drawing, double-click or complete the shape.</li>
                  <li>When you're done click save.</li>
                </ol>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>
        {/* modal end */}
      </Page>
    </Frame>
  )
}