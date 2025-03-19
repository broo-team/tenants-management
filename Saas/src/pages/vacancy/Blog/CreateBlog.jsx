import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";

const CreateBlog = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentService, setCurrentService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  // Fetch all services
  const fetchServices = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/news/blog");
      setServices(data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error("Failed to fetch services!");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      // Append image if selected
      if (image) {
        formData.append("blog", image);
      } else {
        message.error("Please upload an image!");
        return; // Prevent submission if no image is selected
      }

      if (currentService) {
        // Update existing service
        await axios.put(
          `http://localhost:5000/news/update/blog/${currentService.id}`,
          formData
        );
        message.success("Service updated successfully!");
      } else {
        // Create new service
        await axios.post("http://localhost:5000/news/create/blog", formData);
        message.success("Service created successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setCurrentService(null);
      setImage(null); // Reset image after submit
      fetchServices();
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error("Failed to save service!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/news/delete/blog/${id}`);
      message.success("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error("Failed to delete service!");
    }
  };

  // Handle edit service
  const handleEdit = (service) => {
    setCurrentService(service);
    form.setFieldsValue({
      title: service.title,
      description: service.description,
    });
    setIsModalOpen(true);
  };

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isValid =
        file.type === "image/jpeg" || file.type === "image/png"; // File type check
      if (!isValid) {
        message.error("You can only upload JPG/PNG files!");
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2; // File size check (max 2MB)
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return;
      }

      setImage(file); // Set image if valid
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>News And Blog</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add News
      </Button>
      <Table
        dataSource={services}
        rowKey="id"
        style={{ marginTop: "20px" }}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Description",
            dataIndex: "description",
          },
          {
            title: "Photo",
            dataIndex: "image",
            render: (photo) =>
              photo ? (
                <img
                  src={`http://localhost:5000/uploads/${photo}`}
                  alt="service"
                  style={{ width: "100px" }}
                />
              ) : (
                "No Photo"
              ),
          },
          {
            title: "Date",
            dataIndex: "createdAt",
          },
          {
            title: "Actions",
            render: (text, record) => (
              <>
                <Button
                  type="link"
                  onClick={() => handleEdit(record)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this service?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={currentService ? "Edit Service" : "Add News"}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentService(null);
          form.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              setCurrentService(null);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
          >
            {currentService ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            title: "",
            description: "",
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Photo"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
            />
            {image && (
              <div>
                <strong>Selected Image: </strong>
                {image.name} <br />
                <img
                  src={URL.createObjectURL(image)}
                  alt="selected"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateBlog;