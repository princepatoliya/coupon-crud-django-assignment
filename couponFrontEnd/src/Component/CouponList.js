import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../Common/toast";
import * as BaseClient from "../Common/BaseClient";

const CouponList = (props) => {
  const [couponList, setCouponList] = useState([]);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  const [modalFormValues, setModalFormValues] = useState({
    ID: 0,
    Code: "",
    StartDate: "",
    EndDate: "",
    Value: 0,
    IsPercentage: false,
  });

  const getAllCouponsCode = async () => {
    const CouponCodeList = await BaseClient._get(`http://127.0.0.1:8000/api/coupon/`, null, { "Content-Type": "application/json;charset=UTF-8" });
    setCouponList(CouponCodeList.data);
  };

  useEffect(() => {
    getAllCouponsCode();
  }, []);

  // Coupon Edit Handlers
  const handleEditClose = () => setEditShow(false);
  const handleEditEvent = async (pId) => {
    setEditShow(true);

    const couponData = await BaseClient._get(`http://127.0.0.1:8000/api/coupon/${pId}/`, null, { "Content-Type": "application/json;charset=UTF-8" });
    
    setModalFormValues({
      ID: couponData.data.id,
      Code: couponData.data.code,
      StartDate: formatDateToISO(couponData.data.start_date),
      EndDate: formatDateToISO(couponData.data.end_date),
      Value: couponData.data.value,
      IsPercentage: couponData.data.is_percentage,
    });
  };
  const handleCouponEditSubmit = async (data) => {
    console.log("Edit submit", data);

    if (data.IsPercentage === true && data.Value > 100) {
      toastError("Percentage coupon value must be less or equal to 100");
      return;
    }

    const startDateObj = new Date(data.StartDate);
    const endDateObj = new Date(data.EndDate);
    const payload = {
      end_date: new Date(endDateObj.getTime() + endDateObj.getTimezoneOffset() * 60000).toISOString(),
      start_date: new Date(startDateObj.getTime() + startDateObj.getTimezoneOffset() * 60000).toISOString(),
      is_percentage: data.IsPercentage,
      value: data.Value,
    };

    await BaseClient._patch(`http://127.0.0.1:8000/api/coupon/${data.ID}/`, null, { data: payload }, { "Content-Type": "application/json;charset=UTF-8" });

    toastSuccess("Coupon updated");
    getAllCouponsCode();
    handleEditClose();
  };

  // Coupon Delete Handlers
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteEvent = async (pId) => {
    setDeleteShow(true);
    setModalFormValues({ ID: pId });
  };
  const handleCouponDeleteSubmit = async (data) => {
    console.log("delete data: ", data);
    await BaseClient._delete(`http://127.0.0.1:8000/api/coupon/${data.ID}/`, null, { "Content-Type": "application/json;charset=UTF-8" });
    toastSuccess("Coupon deleted");
    getAllCouponsCode();
    handleDeleteClose();
  };

  // Coupon Create Handlers
  const handleCreateClose = () => setCreateShow(false);
  const handleCreateEvent = () => {
    setCreateShow(true);
    setModalFormValues({});
  };
  const handleCouponCreateSubmit = async (data) => {
    console.log("create Data => ", data);

    if (data.IsPercentage === true && data.Value > 100) {
      toastError("Percentage coupon value must be less or equal to 100");
      return;
    }

    const startDateObj = new Date(data.StartDate);
    const endDateObj = new Date(data.EndDate);
    const payload = {
      code: data.Code,
      end_date: new Date(endDateObj.getTime() + endDateObj.getTimezoneOffset() * 60000).toISOString(),
      start_date: new Date(startDateObj.getTime() + startDateObj.getTimezoneOffset() * 60000).toISOString(),
      is_percentage: data.IsPercentage,
      value: data.Value,
    };

    await BaseClient._post(`http://127.0.0.1:8000/api/coupon/`, null, { data: payload }, { "Content-Type": "application/json;charset=UTF-8" });
    toastSuccess("Coupon Created");
    getAllCouponsCode();
    handleCreateClose();
  };

  const formatDate = (string) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  };

  function formatDateToISO(dateString) {
    // Create a new Date object from the datetime string
    const dateTime = new Date(dateString);

    // Extract the date and time components from the date object
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    // Concatenate the date and time components into the required format
    const localDatetimeStr = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Return the converted datetime string
    return localDatetimeStr;
  }

  const validationSchema = Yup.object().shape({
    Code: Yup.string().max(6, "Code must be less than or equal to 6 characters").required("Code is required"),
    Value: Yup.number().required("Value is required"),
    StartDate: Yup.date().required("Start Date is required"),
    EndDate: Yup.date().min(Yup.ref("StartDate"), "End Date must be greater than Start Date").required("End Date is required"),
  });

  const generateRandomCouponCode = () => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setModalFormValues({ ...modalFormValues, Code: result });
  };

  // const randomString = Array(6).fill().map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      width: "5%",
    },
    {
      name: "Start Data",
      selector: (row) => formatDate(row.start_date),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => formatDate(row.end_date),
      sortable: true,
    },
    {
      name: "Code",
      selector: "code",
      sortable: true,
    },
    {
      name: "Value",
      selector: "value",
      sortable: true,
    },
    {
      name: "Is Percentage",
      selector: "is_percentage",
      sortable: true,
      cell: (row) => (
        <>
          <input
            type="checkbox"
            style={{ width: "1.25em", height: "1.25em" }}
            name="IsPercentage"
            id="IsPercentage"
            checked={row.is_percentage}
            className="checkbox form-check-input"
            disabled
          />
        </>
      ),
    },
    {
      name: "Created At",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row) => formatDate(row.updated_at),
      sortable: true,
    },
    {
      name: "Action",
      width: "15%",
      cell: (row) => (
        <>
          <Link
            data-bs-toggle="modal"
            data-backdrop="static"
            data-keyboard="false"
            className="me-3"
            data-bs-target="#editModel"
            onClick={() => handleEditEvent(row.id)}
          >
            <i className="fa fa-edit text-dark fa-2x" data-bs-toggle="tooltip" title="Edit"></i>
          </Link>

          <Link data-bs-toggle="modal" data-backdrop="static" data-keyboard="false" data-bs-target="#deleteModel" onClick={() => handleDeleteEvent(row.id)}>
            <i className="fa fa-trash text-danger fa-2x" data-bs-toggle="tooltip" title="Delete"></i>
          </Link>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <ToastContainer />
      <Container className="mt-4">
        <Row>
          <Col md={10}>
            <h4>Coupon List</h4>
          </Col>
          <Col md={2}>
            <Link
              data-bs-toggle="modal"
              data-backdrop="static"
              data-keyboard="false"
              data-bs-target="#createModel"
              className="btn btn-secondary mb-3 "
              onClick={handleCreateEvent}
            >
              Create Coupon
            </Link>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <div className="card mb-0">
              <div className="card-body">
                <div className="table-responsive">
                  <DataTable columns={columns} data={couponList} highlightOnHover responsive />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={editShow} onHide={handleEditClose} className="modal-md" id="editModel">
        <Modal.Header>
          <Modal.Title>Edit Coupon Code </Modal.Title>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleEditClose}></button>
        </Modal.Header>
        <Formik {...props} initialValues={modalFormValues} onSubmit={handleCouponEditSubmit} validationSchema={validationSchema} enableReinitialize>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            // eslint-disable-next-line react/jsx-no-undef
            <Form>
              <div className="modal-body">
                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Coupon Code</label>
                  <div className="col-md-6 mt-2">
                    <Field
                      type="text"
                      name="Code"
                      id="Code"
                      className={`form-control ${errors.Code ? "is-invalid" : ""}`}
                      placeholder="Enter Coupon Codes"
                      disabled
                    />
                    <div className="invalid-feedback">{touched.Code && errors.Code ? errors.Code : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Is Percentage</label>
                  <div className="col-md-9 mt-2">
                    <Field
                      type="checkbox"
                      style={{ width: "1.25em", height: "1.25em" }}
                      name="IsPercentage"
                      id="IsPercentage"
                      className={`form-check-input ${errors.IsPercentage ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">{touched.IsPercentage && errors.IsPercentage ? errors.IsPercentage : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Value</label>
                  <div className="col-md-9 mt-2">
                    <Field
                      type="number"
                      name="Value"
                      id="Value"
                      className={`form-control ${errors.Value ? "is-invalid" : ""}`}
                      placeholder="Enter Coupon Value"
                    />
                    <div className="invalid-feedback">{touched.Value && errors.Value ? errors.Value : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Start Date</label>
                  <div className="col-md-9 mt-2">
                    <Field type="datetime-local" className={`form-control ${errors.StartDate ? "is-invalid" : ""}`} id="StartDate" name="StartDate" />
                    <div className="invalid-feedback">{touched.StartDate && errors.StartDate ? errors.StartDate : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">End Date</label>
                  <div className="col-md-9 mt-2">
                    <Field type="datetime-local" className={`form-control ${errors.EndDate ? "is-invalid" : ""}`} id="EndDate" name="EndDate" />
                    <div className="invalid-feedback">{touched.EndDate && errors.EndDate ? errors.EndDate : ""}</div>
                  </div>
                </div>

                <div className="col-lg-12 justify-content-right mt-3">
                  <button type="submit" className="btn btn-primary btn-md me-2">
                    Update
                  </button>

                  <button className="btn btn-outline-dark btn-md me-1 " onClick={handleEditClose}>
                    Close
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal show={deleteShow} onHide={handleDeleteClose} className="modal-md" id="deleteModel">
        <Modal.Header>
          <Modal.Title>Are you sure want to delete ? </Modal.Title>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleDeleteClose}></button>
        </Modal.Header>
        <Formik {...props} initialValues={modalFormValues} onSubmit={handleCouponDeleteSubmit} enableReinitialize>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            // eslint-disable-next-line react/jsx-no-undef
            <Form>
              <div className="modal-body">
                <div className="col-lg-12 justify-content-right">
                  <button
                    type="submit"
                    className="btn btn-danger btn-md me-2"
                    // onClick={handleCouponDeleteEvent}
                  >
                    Delete
                  </button>

                  <button className="btn btn-outline-dark btn-md me-1 " onClick={handleDeleteClose}>
                    Close
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal show={createShow} onHide={handleCreateClose} className="modal-md" id="createModel">
        <Modal.Header>
          <Modal.Title>Create Coupon </Modal.Title>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleCreateClose}></button>
        </Modal.Header>

        <Formik {...props} initialValues={modalFormValues} onSubmit={handleCouponCreateSubmit} validationSchema={validationSchema} enableReinitialize>
          {({ values, errors, touched, handleChange, handleBlur }) => (
            // eslint-disable-next-line react/jsx-no-undef
            <Form>
              <div className="modal-body">
                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Coupon Code</label>
                  <div className="col-md-6 mt-2">
                    <Field type="text" name="Code" id="Code" className={`form-control ${errors.Code ? "is-invalid" : ""}`} placeholder="Enter Coupon Codes" />
                    <div className="invalid-feedback">{touched.Code && errors.Code ? errors.Code : ""}</div>
                  </div>
                  <div className="col mt-2">
                    <Link>
                      <button className="btn btn-outline-secondary btn-md me-1 " onClick={generateRandomCouponCode}>
                        Generate
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Is Percentage</label>
                  <div className="col-md-9 mt-2">
                    <Field
                      type="checkbox"
                      style={{ width: "1.25em", height: "1.25em" }}
                      name="IsPercentage"
                      id="IsPercentage"
                      className={`form-check-input ${errors.IsPercentage ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">{touched.IsPercentage && errors.IsPercentage ? errors.IsPercentage : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Value</label>
                  <div className="col-md-9 mt-2">
                    <Field
                      type="number"
                      name="Value"
                      id="Value"
                      className={`form-control ${errors.Value ? "is-invalid" : ""}`}
                      placeholder="Enter Coupon Value"
                    />
                    <div className="invalid-feedback">{touched.Value && errors.Value ? errors.Value : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">Start Date</label>
                  <div className="col-md-9 mt-2">
                    <Field type="datetime-local" className={`form-control ${errors.StartDate ? "is-invalid" : ""}`} id="StartDate" name="StartDate" />
                    <div className="invalid-feedback">{touched.StartDate && errors.StartDate ? errors.StartDate : ""}</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-md-3 align-center">End Date</label>
                  <div className="col-md-9 mt-2">
                    <Field type="datetime-local" className={`form-control ${errors.EndDate ? "is-invalid" : ""}`} id="EndDate" name="EndDate" />
                    <div className="invalid-feedback">{touched.EndDate && errors.EndDate ? errors.EndDate : ""}</div>
                  </div>
                </div>

                <div className="col-lg-12 justify-content-right mt-3">
                  <button type="submit" className="btn btn-primary btn-md me-2">
                    Create
                  </button>

                  <button className="btn btn-outline-dark btn-md me-1 " onClick={handleCouponCreateSubmit}>
                    Close
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default CouponList;
