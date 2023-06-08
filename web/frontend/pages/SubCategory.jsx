import {
    Frame,
    Page,
    Layout,
    LegacyCard,
    LegacyStack,
    Filters,
    DataTable,
    Spinner,
    Button,
    Modal,
    Form,
    FormLayout,
    Select,
    TextField,
    Toast,
    Icon,
    ButtonGroup,
} from '@shopify/polaris';
import { ChevronLeftMinor } from '@shopify/polaris-icons';
import ReactPaginate from "react-paginate";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { Link, useNavigate } from "react-router-dom";

export default function SubCategory(props) {
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
    const [childList, setChildList] = useState("");

    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteModalHandle = useCallback(() => setDeleteModal(!deleteModal), [deleteModal]);
    const [deleteVal, setDeleteVal] = useState({ category_name: "", category_id: 0 });

    // selete option
    const [selected, setSelected] = useState("art_image");
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
        console.log('use_effect')
        const response = await fetch(`${API_URL}/get-art-category/${categoryId}`);
        const categoryData = await response.json();
        setRows(categoryData.data);
        setSubCategory(categoryData.data[0].sub_category);
        setCategoryName(categoryData.data[0].name);
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
            [<h1>{category.name}</h1>,
            <div style={{ display: "inline-flex" }}>
                <Button destructive id={category.id} onClick={() => {
                    setDeleteVal({ category_name: `${category.name}`, category_id: `${category.id}` });
                    deleteModalHandle();
                }}>Delete </Button>
                <a href={void 0} style={{ marginLeft: "8px" }}><Button primary id={category.id} onClick={() => navigate(`/subCategoryList/?id=${categoryId}&sub_category_id=${category.id}`)}>{(category.child_list == "art_sub_category") ? "Add Art Sub Category" : "Art Image"} </Button></a>
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
            child_list: selected
        };
        const response = await fetch(`${API_URL}/create-art-sub-category/${categoryId}`, {
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
            setToastErrStatus(true)
        }
        setActivePreview(!activePreview);
    }

    // delete category
    const deleteCategory = async () => {
        deleteModalHandle();
        setLoadingStatus(true);
        const deleteId = deleteVal.category_id;
        const response = await fetch(`${API_URL}/delete-art-sub-category/${deleteId}`, {
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
                        <Link to="/category">
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
                                        </ul>
                                    </div>
                                    <div className="header_btns">
                                        <a href={void 0} onClick={changePreviewHandle} style={{ marginLeft: "8px" }}>
                                            <Button primary>
                                                Add Art Category
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Sub Art Category List">
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
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
                {/* modal start */}
                <div>
                    <Modal
                        open={activePreview}
                        onClose={changePreviewHandle}
                        title="Add Art Category"
                        primaryAction={{
                            content: 'Save',
                            onAction: saveSubCategory,
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
                                        <Select
                                            label="Selete child list"
                                            options={options}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />
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