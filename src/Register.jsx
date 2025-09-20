import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation simple des champs
        if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
            Swal.fire({
                icon: "error",
                title: "Input Error",
                text: "All fields are required.",
            });
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                text: "Passwords do not match.",
            });
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
            const token = response.data.authorisation.token;
            localStorage.setItem("token", token);

            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "You have successfully registered!",
            }).then(() => {
                navigate("/dashboard");
            });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setValidationErrors(error.response.data);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred. Please try again later.",
                });
            }
        }
    };

    const imagePath = process.env.PUBLIC_URL + '/images/bg-image.webp';

    return (
        <section className="vh-100 bg-image" style={{ backgroundImage: `url('${imagePath}')` }}>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: '15px' }}>
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">Register</h2>
                                    <form method="POST" onSubmit={handleSubmit}>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter Name"
                                                className="form-control"
                                                onChange={handleChange}
                                            />
                                            {validationErrors.name && <span className="text-danger">{validationErrors.name[0]}</span>}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Enter Email"
                                                className="form-control"
                                                onChange={handleChange}
                                            />
                                            {validationErrors.email && <span className="text-danger">{validationErrors.email[0]}</span>}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Enter Password"
                                                className="form-control"
                                                onChange={handleChange}
                                            />
                                            {validationErrors.password && <span className="text-danger">{validationErrors.password[0]}</span>}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                placeholder="Confirm Password"
                                                className="form-control"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary mt-4">Register</button>
                                    </form>

                                    <p className="text-center text-muted mt-5 mb-0">
                                        Already have an account? <a href="/login" className="fw-bold text-body"><u>Login here</u></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
