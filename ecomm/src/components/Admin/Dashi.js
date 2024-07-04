import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function Dashi() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    price: "",
    propertyImg: "",
  });
  const [newImg, setNewImg] = useState();

  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const setuserupdatedata = async (id) => {
    const response = await fetch(`http://localhost:9000/propertybyid/${id}`);
    const data = await response.json();

    console.log(data);
    setNewImg(data.images);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/getproperty/get");
      console.log("Response:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClickOpen = () => {
    setIsEdit(false);
    setFormData({});
    setOpen(true);
  };

  const handleEditClick = (rowData) => {
    setIsEdit(true);
    setFormData(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFormData({
      ...formData,
      propertyImg: file,
    });

    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("features", formData.features);
    formDataToSend.append("price", formData.price);

    formDataToSend.append("propertyImg", formData.propertyImg);

    try {
      if (isEdit) {
        setuserupdatedata(formData.id);
        formDataToSend.append("old_img", newImg);

        await axios.put(
          `http://localhost:9000/property/update/${formData.id}`,
          formDataToSend
        );
      } else {
        await axios.post("http://localhost:9000/property/add", formDataToSend);
      }
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/property/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "55vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20px" }}
        >
          Add
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>

                <TableCell>Description</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>Price</TableCell>

                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      width={55}
                      src={`http://localhost:9000/uploads/${row.images}`}
                    />
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.features}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(row.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>{isEdit ? "Edit Details" : "Add New"}</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                fullWidth
                name="title"
                value={formData.title || ""}
                onChange={handleFormChange}
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={formData.description || ""}
                onChange={handleFormChange}
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Features"
                fullWidth
                name="features"
                value={formData.features || ""}
                onChange={handleFormChange}
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Price"
                fullWidth
                name="price"
                value={formData.price || ""}
                onChange={handleFormChange}
                style={{ marginBottom: "10px" }}
              />
              <input
                type="file"
                accept="image/*"
                name="propertyImg"
                onChange={handleImageChange}
                style={{ marginBottom: "10px" }}
              />

              <input
                type="hidden"
                name="old_img"
                value={newImg}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" color="primary">
                {isEdit ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </div>
  );
}
