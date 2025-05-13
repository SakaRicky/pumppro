import React, { forwardRef, useState } from "react";
import { useNotify } from "hooks/useNotify";
import { saveUser, updateUser } from "services/users";
import { Box, Button, Grid, useTheme } from "@mui/material";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import "react-phone-input-2/lib/style.css";
import TextInput from "components/inputs/TextInput";
import PhoneInputField from "components/inputs/PhoneInput";
import RadioGroupInput from "components/inputs/RadioInput";
import { Gender, NewUser, Role, User } from "types";
import * as yup from "yup";
import { Form, Formik } from "formik";
import DatePickerWrapper from "components/inputs/DatePickerWrapper";
import FlexBetween from "components/FlexBetween";
import { PreviewImage } from "components/PrevieImage";
import { useNavigate } from "react-router-dom";
import { AppError } from "errors/appError";
import { AuthError } from "errors/ApiErrors";

type Props = {
  handleCloseModal: () => void;
  worker?: User; // Optional prop for existing worker
};

const WorkerForm = forwardRef(
  ({ handleCloseModal, worker }: Props, ref: any) => {
    const theme = useTheme();
    const notify = useNotify();

    const isEditMode = !!worker;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [picture, setPicture] = useState<File | null>(null);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) {
        return;
      }
      const uploadedPicture = e.target.files[0];
      setPicture(uploadedPicture);
      e.target.files = null;
    };

    const initialValues: NewUser = {
      names: isEditMode ? worker.names : "",
      username: isEditMode ? worker.username : "",
      date_of_birth: isEditMode ? worker.date_of_birth : new Date(),
      email: isEditMode ? worker.email || "" : "",
      password: "",
      passwordConfirmation: "",
      gender: isEditMode ? worker.gender : Gender.FEMALE,
      phone: isEditMode ? worker.phone : "",
      salary: isEditMode ? worker.salary : 0,
      godfather_phone: isEditMode ? worker.godfather_phone : "",
      localisation: isEditMode ? worker.localisation || "" : "",
      role: isEditMode ? worker.role : Role.ADMIN,
      CNI_number: isEditMode ? worker.CNI_number : "",
    };

    const createValidationSchema = yup.object({
      names: yup.string().required("Names is required"),
      username: yup.string().required("username is required"),
      date_of_birth: yup.date().required("Date of birth is required"),
      email: yup.string().email().nullable(),
      password: yup.string().when("role", {
        is: (role: string) => role === Role.SALE || role === Role.ADMIN,
        then: yup
          .string()
          .required("An admin or sales person must have password"),
      }),
      passwordConfirmation: yup
        .string()
        .test("passwords-match", "Passwords must match", function (value) {
          return this.parent.password === value;
        }),
      gender: yup.mixed().oneOf(["MALE", "FEMALE"]).required(),
      phone: yup
        .string()
        .test("validatePhone", "Invalid phone number", (value) => {
          return value ? value.length === 12 : false;
        }),
      salary: yup.number().min(1).required("Salary should be > 0"),
      godfather_phone: yup.string().required("Phone number is not valid"),
      localisation: yup.string(),
      role: yup.mixed().oneOf([Role.ADMIN, Role.PUMPIST, Role.SALE, Role.USER]),
      CNI_number: yup
        .string()
        .required("CNI number is required")
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),
    });

    const editValidationSchema = yup.object({
      names: yup.string().required("Names is required"),
      username: yup.string().required("username is required"),
      date_of_birth: yup.date().required("Date of birth is required"),
      email: yup.string().email().nullable(),
      password: yup.string(),
      passwordConfirmation: yup
        .string()
        .test("passwords-match", "Passwords must match", function (value) {
          return this.parent.password === value;
        }),
      gender: yup.mixed().oneOf(["MALE", "FEMALE"]).required(),
      phone: yup
        .string()
        .test("validatePhone", "Invalid phone number", (value) => {
          return value ? value.length === 12 : false;
        }),
      salary: yup.number().min(1).required("Salary should be > 0"),
      godfather_phone: yup.string().required("Phone number is not valid"),
      localisation: yup.string(),
      role: yup.mixed().oneOf([Role.ADMIN, Role.PUMPIST, Role.SALE, Role.USER]),
      CNI_number: yup
        .string()
        .required("CNI number is required")
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),
    });

    const validationSchema = isEditMode
      ? editValidationSchema
      : createValidationSchema;

    const onNewWorkerSubmit = async (data: NewUser) => {
      setLoading(true);
      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "number") {
          formData.append(key, value.toString());
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value);
        }
      }
      if (picture) {
        formData.append("file", picture, picture?.name);
      }

      try {
        if (isEditMode) {
          formData.append("id", worker.id);
          await updateUser(formData);
          notify("Edit Success", "User edited successfully", "success");
          handleCloseModal();
          setLoading(false);
        } else {
          await saveUser(formData);
          notify("Save Success", "User saved successfully", "success");
          handleCloseModal();
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof AppError) {
          notify("Login Error", error.message, "error");
        }
        if (error instanceof Error) {
          notify("Login Error", error.message, "error");
        }
        if (error instanceof AuthError) {
          notify("Login Error", error.message, "error");
          navigate("/login");
        }
        setLoading(false);
      }
    };

    return (
      <Box
        ref={ref}
        p={4}
        sx={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(4, 110, 174) 0px 0px 0px 3px",
          backgroundColor: theme.palette.background.alt,
          width: "80%",
          height: "80%",
          mt: "5rem",
          overflowY: "auto",
        }}
      >
        <Typography variant="h2" fontSize="2rem" mb="2rem" textAlign="center">
          <FormattedMessage
            id="form.worker.heading"
            defaultMessage={isEditMode ? "Edit Worker" : "Add New Worker"}
          />
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validate={() => ({})}
          onSubmit={(values) => {
            onNewWorkerSubmit(values);
          }}
        >
          <Form>
            <Grid
              container
              spacing={{ xs: 0, sm: 2, md: 3 }}
              rowSpacing={2}
              columns={9}
            >
              <Grid item xs={12} sm={6} md={4}>
                <TextInput type="text" label="Full Names" name="names" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput type="text" label="Username" name="username" />
              </Grid>
              <Grid item xs={6} md={3}>
                <DatePickerWrapper name="date_of_birth" label="Date of Birth" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextInput type="email" label="Email" name="email" />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextInput type="text" label="CNI Number" name="CNI_number" />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextInput type="number" label="Salary" name="salary" />
              </Grid>
              <Grid item xs={6} md={3}>
                <PhoneInputField label="Phone" name="phone" />
              </Grid>
              <Grid item xs={6} md={3}>
                <RadioGroupInput
                  label="Gender"
                  name="gender"
                  options={[Gender.FEMALE, Gender.MALE]}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <PhoneInputField
                  label="Godfather's Phone Number"
                  name="godfather_phone"
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <RadioGroupInput
                  label="Role"
                  name="role"
                  options={[Role.ADMIN, Role.PUMPIST, Role.SALE, Role.USER]}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextInput type="password" label="Password" name="password" />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextInput
                  type="password"
                  label="Confirm Password"
                  name="passwordConfirmation"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextInput
                  type="text"
                  label="Localisation"
                  name="localisation"
                  multiline
                />
              </Grid>
            </Grid>

            <FlexBetween sx={{ mt: 4 }}>
              <Button
                variant="contained"
                component="label"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                <FormattedMessage
                  id="upload.upload"
                  defaultMessage="Upload Picture"
                />
                <input type="file" hidden onChange={handleFileInputChange} />
              </Button>
              <Box
                sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}
              >
                {picture && (
                  <Box
                    sx={{
                      width: "10rem",
                      height: "10rem",
                    }}
                  >
                    <PreviewImage
                      imageFile={picture}
                      handleDeleteImage={() => setPicture(null)}
                    />
                  </Box>
                )}
                {isEditMode && Boolean(worker.profile_picture) && (
                  <img
                    style={{
                      borderRadius: "50%",
                      marginTop: "1rem",
                      padding: "2px",
                      border: `1px solid ${theme.palette.grey[600]}`,
                      objectFit: "cover",
                      width: "10rem",
                      height: "10rem",
                    }}
                    src={worker.profile_picture}
                    alt="profile"
                  />
                )}
              </Box>
              <LoadingButton
                type="submit"
                loading={loading}
                endIcon={<AddIcon />}
                loadingPosition="end"
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.grey[50],

                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                {isEditMode ? "Edit Worker" : "Add Worker"}
              </LoadingButton>
            </FlexBetween>
          </Form>
        </Formik>
      </Box>
    );
  }
);

export default WorkerForm;
