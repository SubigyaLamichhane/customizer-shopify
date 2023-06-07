import {
    LegacyCard,
    LegacyStack,
    Filters,
    DataTable,
    Button,
    Modal,
    Form,
    FormLayout,
    TextField,
    ButtonGroup,
    Toast,
    Spinner
} from "@shopify/polaris";
import ReactPaginate from "react-paginate";
import { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { SketchPicker } from 'react-color'

export default function FontColorSetting(props) {
    const API_URL = props.API_URL;
    const fetch = useAuthenticatedFetch();
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
    const [color, setColor] = useState("");
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteModalHandle = useCallback(() => setDeleteModal(!deleteModal), [deleteModal]);
    const [deleteVal, setDeleteVal] = useState({ id: 0, name: "" });

    // delete item
    const deleteItem = async () => {
        deleteModalHandle();
        setLoadingStatus(true);
        const deleteId = deleteVal.id;
        const response = await fetch(`${API_URL}/delete-text-outline-color/${deleteId}`, {
            method: "Delete"
        });
        const res = await response.json();

        if (res.status === true) {
            setToastContent(res.message);
            setDeleteVal({ id: "", name: "" });
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
        const response = await fetch(`${API_URL}/get-text-outline-colors`);
        const productList = await response.json();
        setRows(productList.data);
        setLoadingStatus(false);
    }, [rowUpdate]);

    var allData = rows?.filter((category) => {
        if (searchTerm == "") {
            return category;
        } else if (category.name?.toLowerCase().includes(searchTerm?.toLowerCase())) {
            return category;
        }
    }).map(category => {
        return (
            [`${category.name}`,
            <div style={{
                backgroundColor: category.color,
                width: "40px",
                height: "40px"
            }}></div>,
            <div style={{ display: "inline-flex" }}>
                <Button destructive id={category.id} onClick={() => {
                    setDeleteVal({ name: `${category.name}`, id: `${category.id}` });
                    deleteModalHandle();
                }}>Delete </Button>
            </div>
            ]
        )
    }).reverse();

    var pageCount = 0;
    var allTableData = [];
    if (allData) {
        pageCount = Math.ceil(allData.length / usersPerPage);
        allTableData = allData.slice(pagesVisited, pagesVisited + usersPerPage);
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
            setDataCount(allTableData.length);
        } else {
            setDataCount((usersPerPage * pageNumber) + allTableData.length);
        }
    }, [rows, pageNumber, searchTerm]);
    // filter code end

    // modal functionality
    const [activePreview, setActivePreview] = useState(false);
    const changePreviewHandle = useCallback(() => setActivePreview(!activePreview), [activePreview]);

    // save font color
    const saveItem = async () => {
        setLoadingStatus(true);
        if (name === "") {
            setLoadingStatus(false);
            setNameError(true);
            return false;
        }
        if (color === "") {
            setLoadingStatus(false);
            setColorError(true);
            return false;
        }
        let data = {
            name: name,
            color: color
        };
        const response = await fetch(`${API_URL}/create-text-outline-color`, {
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
        }
        else {
            setLoadingStatus(false);
            setToastContent(res.message);
            setToastErrStatus(true)
        }
        setActivePreview(!activePreview);
    }

    // handle color
    const handleChangeComplete = (color) => {
        console.log(color.hex);
        setColor(color.hex);
    };

    return (
        <LegacyCard sectioned>
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
            <div className='button-right'>
                <a href={void 0} onClick={changePreviewHandle} style={{ marginLeft: "8px" }}>
                    <Button primary>
                        Add Outline Color
                    </Button>
                </a>
            </div><br /><br />
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
                    <h1 className='Polaris-Heading'>Name</h1>,
                    <h1 className='Polaris-Heading'>Color</h1>,
                    <h1 className='Polaris-Heading'>Action</h1>
                ]}
                rows={allTableData}
                footerContent={`Showing ${dataCount} of ${allData ? allData.length : "0"} results`}
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

            {/* modal start */}
            <div>
                <Modal
                    open={activePreview}
                    onClose={changePreviewHandle}
                    title="Add Outline Color"
                    primaryAction={{
                        content: 'Save',
                        onAction: saveItem,
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
                                        label="Font Outline Color Name"
                                        type="text"
                                        autoComplete="off"
                                        placeholder='Please enter value'
                                        error={nameError && "Can not be empty!"}
                                    />
                                    <p>Font Outline Color</p>
                                    <SketchPicker
                                        color={color}
                                        onChange={handleChangeComplete}
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
                                <p>You want to delete <b variation="strong">"{deleteVal.name}"</b> font color.</p>
                                <ButtonGroup>
                                    <Button onClick={deleteModalHandle}>Cancel</Button>
                                    <Button destructive onClick={deleteItem}>Delete</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </Modal.Section>
                </Modal>
            </div>
            {/* delete modal end */}
        </LegacyCard>
    )
}