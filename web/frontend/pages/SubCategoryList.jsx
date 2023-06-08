import {
    Page,
    Layout,
    LegacyCard,
    LegacyStack,
    Thumbnail,
    Frame,
    Spinner,
    Button,
    Modal,
    Form,
    FormLayout,
    Text,
    TextField,
    Select,
    DropZone,
    Toast,
    Filters,
    DataTable,
    Icon,
    ButtonGroup
} from '@shopify/polaris';
import { ChevronLeftMinor, AlertMinor, NoteMinor } from '@shopify/polaris-icons';
import ReactPaginate from "react-paginate";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import dummyImage from "../assets/images/dummy-image.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function SubCategoryList(props) {
    const API_URL = props.API_URL;
    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate();
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [toastMsg, setToastMsg] = useState();
    const [toastContent, setToastContent] = useState("");
    const [toastErrStatus, setToastErrStatus] = useState(false);
    const [rows, setRows] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [rowUpdate, setRowUpdate] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("id");
    const subCategoryId = urlParams.get("sub_category_id");
    const [childList, setChildList] = useState("");

    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteModalHandle = useCallback(() => setDeleteModal(!deleteModal), [deleteModal]);
    const [deleteVal, setDeleteVal] = useState({ category_name: "", category_id: 0 });

    // selete option
    const [selected, setSelected] = useState('art_image');
    const handleSelectChange = useCallback(
        (value) => setSelected(value),
        [],
    );
    const options = [
        { label: 'Art Image', value: 'art_image' },
        { label: 'Art Category', value: 'art_sub_category' },
    ];

    // call use effect
    useEffect(async () => {
        const response = await fetch(`${API_URL}/get-art-sub-category/${categoryId}/${subCategoryId}`);
        const categoryData = await response.json();
        setRows(categoryData.data);
        setSubCategory(categoryData.data[0].sub_category[0].sub_category_list);
        setCategoryName(categoryData.data[0].name);
        setSubCategoryName(categoryData.data[0].sub_category[0].name);
        if (categoryData.data[0].sub_category) {
            setChildList(categoryData.data[0].sub_category[0].child_list);
        }
        setLoadingStatus(false);
    }, [rowUpdate]);

    var allCategoryData = subCategory?.filter((category) => {
        if (searchTerm == "") {
            return category;
        } else if (category.name?.toLowerCase().includes(searchTerm?.toLowerCase())) {
            return category;
        }
    }).map(category => {
        return (
            [(category.image) ? <Thumbnail
                source={category.image ? category.image : dummyImage}
                alt={category.name}
            /> : <h1>{category.name}</h1>,
            <div style={{ display: "inline-flex" }}>
                <Button destructive id={category.id} onClick={() => {
                    setDeleteVal({ category_name: `${category.name}`, category_id: `${category.id}` });
                    deleteModalHandle();
                }}>Delete </Button>
                {(category.image) ? ""
                    : <a href={void 0} style={{ marginLeft: "8px" }}><Button primary id={category.id} onClick={() => navigate(`/SubCategorySubList/?id=${categoryId}&sub_category_id=${subCategoryId}&sub_category_list_id=${category.id}`)}>Add Art </Button></a>
                }
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
    const [activePreviewSubModal, setActivePreviewSubModal] = useState(false);
    const [activeModal, setActiveModal] = useState("");
    const changePreviewHandle = (val) => {
        setActiveModal(val);
        console.log('val', val)
        if (val == "list")
            setActivePreview(!activePreview)
        else
            setActivePreviewSubModal(!activePreviewSubModal)
    }

    // file upload code
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState("");
    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => {
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
            console.log('acceptedFiles[0].type', acceptedFiles[0].type);
            if (validImageTypes.includes(acceptedFiles[0].type)) {
                if (acceptedFiles[0].size < 2000000) {
                    setFiles((files) => [...files, ...acceptedFiles]),
                        setFileError("");
                } else {
                    setFileError(`“${acceptedFiles[0].name}” is too large. Try a file size less than 2MB.`)
                }
            } else {
                setFileError(`“${acceptedFiles[0].name}” is not supported. File type must be .gif, .jpg, .png or .svg.`)
            }
        },
        [],
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];

    const fileUpload = files ? files.length == 0 && <DropZone.FileUpload /> : "";
    const uploadedFile = files && (
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
    // file upload code end

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

    // save category
    const saveSubCategory = async () => {
        setLoadingStatus(true);
        if (name === "") {
            setLoadingStatus(false);
            setNameError(true);
            return false;
        }
        let data = {
            name: name,
            // child_list: selected
        };
        const response = await fetch(`${API_URL}/create-art-sub-category-list/${subCategoryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        console.log('res', res);
        if (res.status === true) {
            setToastContent(res.message);
            setToastMsg(true);
            setLoadingStatus(false);
            setRowUpdate(!rowUpdate);
            setName("");
        }
        else {
            setLoadingStatus(false);
            setToastContent(res.message);
            setToastErrStatus(true);
        }
        if (activeModal == "list")
            setActivePreview(!activePreview);
        else
            setActivePreviewSubModal(!activePreviewSubModal);
    }

    // save category
    const saveSubCategoryList = async () => {
        setLoadingStatus(true);
        if (!files) {
            setLoadingStatus(false);
            setFilesError("File is required!");
            return false;
        }
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        const response = await fetch(`${API_URL}/create-art-sub-category-list/${subCategoryId}`, {
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
            setFiles();
        }
        else {
            setLoadingStatus(false);
            setToastContent(res.message);
            setToastErrStatus(true);
        }
        if (activeModal == "list")
            setActivePreview(!activePreview);
        else
            setActivePreviewSubModal(!activePreviewSubModal);
    }

    // delete category
    const deleteCategory = async () => {
        deleteModalHandle();
        setLoadingStatus(true);
        const deleteId = deleteVal.category_id;
        const response = await fetch(`${API_URL}/delete-art-sub-category-list/${deleteId}`, {
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
                        <Link to={"/subCategory?id=" + categoryId} >
                            <span><Icon source={ChevronLeftMinor} color="base" /></span>
                            <span className="link_text">Go Back</span>
                        </Link>
                    </div>
                    <div className="header_title">
                        <h1 className='Polaris-Heading'>Art Category</h1>
                    </div>
                </div>
                <Layout>
                    <Layout.Section oneHalf>
                        <LegacyCard>
                            <LegacyCard.Section>
                                <div className="header">
                                    <div className="header_title">
                                        <ul className="breadcrumb">
                                            <li><span>{categoryName}</span></li>
                                            <li><span>{subCategoryName}</span></li>
                                        </ul>
                                    </div>
                                    <div className="header_btns">
                                        {
                                            (childList == "art_sub_category") ?
                                                <a href={void 0} onClick={() => changePreviewHandle("category")} style={{ marginLeft: "8px" }}>
                                                    <Button primary>
                                                        Add Art Category
                                                    </Button>
                                                </a> :
                                                <a href={void 0} onClick={() => changePreviewHandle("list")} style={{ marginLeft: "8px" }}>
                                                    <Button primary>
                                                        Add Art
                                                    </Button>
                                                </a>
                                        }
                                        {/* <a href={void 0} onClick={() => changePreviewHandle("category")} style={{ marginLeft: "8px" }}>
                                            <Button primary>
                                                Add Art Category
                                            </Button>
                                        </a>
                                        <a href={void 0} onClick={() => changePreviewHandle("list")} style={{ marginLeft: "8px" }}>
                                            <Button primary>
                                                Add Art
                                            </Button>
                                        </a> */}
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Sub Category List">
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
                                        'action',
                                    ]}
                                    headings={[
                                        <h1 className='Polaris-Heading'>{(childList == "art_category") ? "Title" : "Art Image"}</h1>,
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
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>

                {/* category modal start */}
                <div>
                    <Modal
                        open={activePreviewSubModal}
                        onClose={() => changePreviewHandle("category")}
                        title="Add Art Category"
                        primaryAction={{
                            content: 'Save',
                            onAction: saveSubCategory,
                        }}
                        secondaryActions={{
                            content: 'Close',
                            onAction: () => changePreviewHandle("category"),
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
                                        {/* <Select
                                            label="Selete child list"
                                            options={options}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        /> */}
                                    </FormLayout>
                                </Form>
                            </LegacyStack>
                        </Modal.Section>
                    </Modal>
                </div>
                {/*  category modal end */}

                {/* list modal start */}
                <div>
                    <Modal
                        open={activePreview}
                        onClose={() => changePreviewHandle("list")}
                        title="Add Art Image"
                        primaryAction={{
                            content: 'Save',
                            onAction: saveSubCategoryList,
                        }}
                        secondaryActions={{
                            content: 'Close',
                            onAction: () => changePreviewHandle("list"),
                        }}
                    >
                        <Modal.Section>
                            <LegacyStack vertical>
                                <Form>
                                    <FormLayout>
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
                                    </FormLayout>
                                </Form>
                            </LegacyStack>
                        </Modal.Section>
                    </Modal>
                </div>
                {/* list modal end */}

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