import {
    Frame,
    Page,
    Layout,
    LegacyCard,
    LegacyStack,
    Filters,
    DataTable,
    Thumbnail,
    Button,
    ButtonGroup,
    Toast,
    Spinner,
    Icon,
    Modal,
    Form,
    FormLayout,
    Text,
    TextField,
    DropZone
} from "@shopify/polaris";
import ReactPaginate from "react-paginate";
import { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import dummyImage from "../assets/images/dummy-image.jpg";
import { useNavigate } from "react-router-dom";
import { AlertMinor } from '@shopify/polaris-icons';

export default function Products(props) {
    const API_URL = props.API_URL;
    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate();
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [toastMsg, setToastMsg] = useState();
    const [toastContent, setToastContent] = useState("");
    const [toastErrStatus, setToastErrStatus] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowUpdate, setRowUpdate] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteModalHandle = useCallback(() => setDeleteModal(!deleteModal), [deleteModal]);
    const [deleteVal, setDeleteVal] = useState({ category_name: "", category_id: 0 });

    // delete category
    const deleteCategory = async () => {
        deleteModalHandle();
        setLoadingStatus(true);
        const deleteId = deleteVal.category_id;
        const response = await fetch(`${API_URL}/delete-art-category/${deleteId}`, {
            method: "Delete"
        });
        const res = await response.json();

        if (res.status === true) {
            setToastContent(res.message);
            setDeleteVal({ category_name: "", category_id: "" });
            setToastMsg(true);
            setLoadingStatus(false);
            setRowUpdate(!rowUpdate);
        }
        else {
            setToastContent(res.message);
            setToastErrStatus(true)
        }
    }

    // handle look name
    const handleName = useCallback((newValue) => {
        if (newValue === "") {
            setNameError(true);
            setName("");
        } else {
            setName(newValue);
            setNameError(false);
        }
    }, []);

    // call use effect
    useEffect(async () => {
        const response = await fetch(`${API_URL}/get-art-category-list`);
        const productList = await response.json();
        setRows(productList.data);
        setLoadingStatus(false);
    }, [rowUpdate]);

    var allCategoryData = rows?.filter((category) => {
        if (searchTerm == "") {
            return category;
        } else if (category.name?.toLowerCase().includes(searchTerm?.toLowerCase())) {
            return category;
        }
    }).map(category => {
        return (
            [<Thumbnail
                source={category.background_image ? category.background_image : dummyImage}
                alt={category.name}
            />,
            `${category.name}`,
            <div style={{ display: "inline-flex" }}>
                <Button destructive id={category.id} onClick={() => {
                    setDeleteVal({ category_name: `${category.name}`, category_id: `${category.id}` });
                    deleteModalHandle();
                }}>Delete </Button>
                <a href={void 0} style={{ marginLeft: "8px" }}><Button primary id={category.id} onClick={() => navigate(`/subCategory/?id=${category.id}`)}>Add Art Sub Category </Button></a>
            </div>
            ]
        )
    }).reverse();

    var pageCount = 0;
    var allCategoryTableData = [];
    if (allCategoryData) {
        pageCount = Math.ceil(allCategoryData.length / usersPerPage);
        allCategoryTableData = allCategoryData.slice(pagesVisited, pagesVisited + usersPerPage);
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
            setDataCount(allCategoryTableData.length);
        } else {
            setDataCount((usersPerPage * pageNumber) + allCategoryTableData.length);
        }
    }, [rows, pageNumber, searchTerm]);
    // filter code end

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

    // save category
    const saveCategory = async () => {
        setLoadingStatus(true);
        if (name === "") {
            setLoadingStatus(false);
            setNameError(true);
            return false;
        }
        if (!file) {
            setLoadingStatus(false);
            setFileError("File is required!");
            return false;
        }

        let formData = new FormData()
        formData.append('name', name);
        formData.append('background_image', file);
        // formData.append('level', level);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        const response = await fetch(`${API_URL}/create-art-category`, {
            method: 'POST',
            body: formData,
            config
        });
        const res = await response.json();
        console.log('res', res);
        if (res.status === true) {
            setToastContent(res.message);
            setToastMsg(true);
            setLoadingStatus(false);
            setRowUpdate(!rowUpdate);
            setName("");
            setFile();
        }
        else {
            setLoadingStatus(false);
            setToastContent(res.message);
            setToastErrStatus(true)
        }
        setActivePreview(!activePreview);
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
                        <h1 className='Polaris-Heading'>List Of Art Category</h1>
                    </div>
                    <div className="header_btns">
                        <a href={void 0} onClick={changePreviewHandle} style={{ marginLeft: "8px" }}>
                            <Button primary>
                                Add Art Category
                            </Button>
                        </a>
                    </div>
                </div>
                <Layout>
                    <Layout.Section>
                        <LegacyCard sectioned>
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
                                    'action',
                                ]}
                                headings={[
                                    <h1 className='Polaris-Heading'>Art Category Image</h1>,
                                    <h1 className='Polaris-Heading'>Title</h1>,
                                    <h1 className='Polaris-Heading'>Actions</h1>
                                ]}
                                rows={allCategoryTableData}
                                footerContent={`Showing ${dataCount} of ${allCategoryData ? allCategoryData.length : "0"} results`}
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
                {/* modal start */}
                <div >
                    <Modal
                        open={activePreview}
                        onClose={changePreviewHandle}
                        title="Create Art Category"
                        primaryAction={{
                            content: 'Save',
                            onAction: saveCategory,
                        }}
                        secondaryActions={{
                            content: 'Close',
                            onAction: changePreviewHandle,
                        }}
                    >
                        <Modal.Section>
                            <LegacyStack vertical>
                                <Form>
                                    <FormLayout>
                                        <TextField
                                            value={name}
                                            onChange={handleName}
                                            label="Category"
                                            type="text"
                                            autoComplete="off"
                                            placeholder='Please enter value'
                                            error={nameError && "Can not be empty!"}
                                        />
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
                                        {/* <Button submit>Submit</Button> */}
                                    </FormLayout>
                                </Form>
                            </LegacyStack>
                        </Modal.Section>
                    </Modal>
                </div>
                {/* modal end */}

                {/* delete modal start */}
                <div>
                    <Modal
                        open={deleteModal}
                        onClose={deleteModalHandle}
                        title=""
                        small
                    >
                        <Modal.Section>
                            <div className="delete_modal_wrapper">
                                <div className="delete_container">
                                    <h1 className="Polaris-Heading">Are you sure!</h1>
                                    <p>You want to delete <b variation="strong">"{deleteVal.category_name}"</b> category.</p>
                                    <ButtonGroup>
                                        <Button onClick={deleteModalHandle}>Cancel</Button>
                                        <Button destructive onClick={deleteCategory}>Delete</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </Modal.Section>
                    </Modal>
                </div>
                {/* delete modal end */}
            </Page>
        </Frame>
    );
}
