import {
  Page, Grid, Button, TextField, LegacyCard, DropZone,
  LegacyStack,
  Thumbnail,
  Banner,
  List,
  Text,
  Select,
} from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks';
import ReactCrop from 'react-image-crop'
export default function ProductMap(props) {
  const API_URL = props.API_URL;
  const fetch = useAuthenticatedFetch();
  const [loadingStatus, setLoadingStatus] = useState();
  const [toastMsg, setToastMsg] = useState();
  const [product, setProduct] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get("id");
  const [title, setTitle] = useState("");
  const [lookName, setLookName] = useState('Front');
  const [image, setImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState('front');
  const [crop, setCrop] = useState({
    unit: '%', // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });

  // const handleSelectChange = useCallback(
  //   (value) => setSelected(value),
  //   [],
  // );
  const options = [
    { label: 'Front', value: 'front' },
    { label: 'Back', value: 'back' },
    { label: 'Left Side', value: 'left' },
    { label: 'Right Side', value: 'right' },
  ];

  // upload file functionality
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
      console.log('useCallback', files),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: '0' }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
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
        ))}
      </LegacyStack>
    </div>
  );

  useEffect(async () => {
    const response = await fetch(`${API_URL}/get-product/${product_id}`);
    const product = await response.json();
    setTitle(product.data.product_title);
    setImage(product.data.product_image);
    setLoadingStatus(false);
  }, []);

  function saveProductMapping() {
    console.log('title',title);
    console.log('lookName',lookName);
    console.log('files',files);
    console.log('selected',selected);
  }

  // const [imageType, setImageType] = useState(false);

  return (
    <Page>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard title={title} sectioned>
            <LegacyCard title="Instruction" sectioned>
              <ol>
                <li>Click Drawing and then add a line or shape.</li>
                <li>Click where to start drawing.</li>
                <li>Click each corner or bend of your line or shape to move the map, click and hold the mouse.</li>
                <li>When you're finished drawing, double-click or complete the shape.</li>
                <li>When you're done click save.</li>
              </ol>
            </LegacyCard>
            <LegacyCard title="More Looks" sectioned>
              <TextField
                label="Look name"
                value={lookName}
                onChange={(e) => { setLookName(e); }}
                autoComplete="off"
              /><br/>
              <Select
                label="Select side"
                options={options}
                onChange={(e) => setSelected(e)}
                value={selected}
              /><br/>
              {/* <Checkbox
                label="Front"
                checked={imageType}
                onChange={handleCheckBox}
              /> */}
              <LegacyStack vertical>
                {/* <DropZone label="Upload Image">
                  <DropZone.FileUpload />
                </DropZone> */}
                <DropZone onDrop={handleDropZoneDrop}>
                  {uploadedFiles}
                  {fileUpload}
                </DropZone>
                <Button primary >Add More Looks</Button>
              </LegacyStack>
            </LegacyCard>
          </LegacyCard>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard sectioned>
            <div className="product_img">
              <ReactCrop crop={crop} onChange={c => { setCrop(c); console.log('crop', crop) }}>
                <img style={{ transform: `scale(1) rotate(0deg)` }} src={files.length > 0 ? window.URL.createObjectURL(files[0]) : image} alt={title} />
              </ReactCrop>
            </div>
            <Button primary onClick={saveProductMapping}>Save theme</Button>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  )
}