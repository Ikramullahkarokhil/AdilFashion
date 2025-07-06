import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Modal,
  ToastAndroid,
  Text,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { Formik } from "formik";
import { updateWaskat } from "../../database";

const DynamicSelectField = ({
  name,
  handleChange,
  items,
  errors,
  value,
  label,
}) => (
  <View style={styles.row}>
    <View style={styles.fieldContainer}>
      <SelectDropdown
        data={items}
        onSelect={(selectedItem) => {
          handleChange(name)(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem) => {
          return selectedItem;
        }}
        rowTextForSelection={(item) => {
          return item;
        }}
        error={errors[name] ? true : false}
        defaultButtonText={label}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownButtonText}
        dropdownStyle={styles.dropdown}
        dropdownTextStyle={styles.dropdownItem}
        rowTextStyle={styles.dropdownItemText}
        value={value} // Pass the value directly as `value`
        statusBarTranslucent={true}
      />
    </View>
  </View>
);

const DynamicInputField = ({
  label,
  name,
  handleChange,
  handleBlur,
  value,
  errors,
  keyboard,
}) => {
  const handleInputChange = (inputValue) => {
    if (keyboard === "numeric" && name !== "phoneNumber") {
      const regex = /^\d{0,2}(\.\d{0,1})?$/;
      if (regex.test(inputValue) || inputValue === "") {
        handleChange(name)(inputValue);
      }
    } else {
      handleChange(name)(inputValue);
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <TextInput
        label={label}
        onChangeText={handleInputChange}
        onBlur={handleBlur(name)}
        value={value}
        style={styles.input}
        error={errors[name] ? true : false}
        keyboardType={keyboard}
        multiline={true}
        textColor="black"
        cursorColor="#0083D0"
        underlineColor="#0083D0"
        activeUnderlineColor="#0083D0"
        placeholderTextColor="#0083D0"
      />
    </View>
  );
};

const shanaTypes = ["نیمه ډاون", "ډاون"];

const UpdateWaskatModel = ({ visible, onClose, customerData }) => {
  const initialValues = {
    name: customerData?.name || "",
    phoneNumber: customerData?.phoneNumber?.toString() || "",
    qad: customerData?.qad?.toString() || "",
    yakhan: customerData?.yakhan || "",
    yakhanValue: customerData?.yakhanValue?.toString() || "",
    shana: customerData?.shana?.toString() || "",
    shanaType: customerData?.shanaType?.toString() || "",
    baghal: customerData?.baghal?.toString() || "",
    kamar: customerData?.kamar?.toString() || "",
    soreen: customerData?.soreen?.toString() || "",
    astin: customerData?.astin?.toString() || "",
    farmaish: customerData?.farmaish || "",
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();

    // Add leading zeros if month or day is less than 10
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return `${year}-${month}-${day}`;
  };

  const selectYakhan = ["وی v", "ګول", "یخندار"];

  const updateCustomerWaskat = async (values) => {
    try {
      const updatedValues = {
        ...values,
        registrationDate: getCurrentDate(),
      };

      await updateWaskat(customerData.id, updatedValues);

      ToastAndroid.show("مشتری موفقانه به روز رسانی شد!", ToastAndroid.SHORT);
      onClose();
    } catch (error) {
      console.error("Error updating waskat:", error);
      ToastAndroid.show("خطا در به روز رسانی معلومات!", ToastAndroid.SHORT);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => updateCustomerWaskat(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.form}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Update Customer Waskat</Text>
              </View>
              <View style={styles.fieldContainer}>
                <DynamicInputField
                  label="نام مشتری"
                  name="name"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.name}
                  errors={errors}
                  keyboard="default"
                />
              </View>
              <View style={styles.fieldContainer}>
                <DynamicInputField
                  label="شماره تلفن"
                  name="phoneNumber"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.phoneNumber}
                  errors={errors}
                  keyboard="numeric"
                />
              </View>
              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="قد"
                    name="qad"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.qad}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="استین"
                    name="astin"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.astin}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="بغل"
                    name="baghal"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.baghal}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="سورین"
                    name="soreen"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.soreen}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
              </View>
              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="کمر"
                    name="kamar"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.kamar}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <DynamicSelectField
                    label={values.yakhan}
                    name="yakhan"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.yakhan}
                    items={selectYakhan}
                    errors={errors}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="شانه"
                    name="shana"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.shana}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="اندازه یخن"
                    name="yakhanValue"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.yakhanValue}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicSelectField
                    label={values.shanaType}
                    name="shanaType"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.shanaType}
                    items={shanaTypes}
                    errors={errors}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="فرمایشات"
                    name="farmaish"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.farmaish}
                    errors={errors}
                    keyboard="default"
                    multiline={true}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  buttonColor="white"
                  textColor="black"
                >
                  Cancel Update
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  buttonColor="#0083D0"
                  textColor="white"
                >
                  Update Customer
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </Modal>
  );
};

export default UpdateWaskatModel;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: "30%",
    backgroundColor: "#F2F5F3",
  },

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 23,
  },

  form: {
    width: "100%",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
    borderColor: "black",
  },
  error: {
    color: "red",
  },
  fieldContainer: {
    flex: 1,
  },

  fieldContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 1,
    borderColor: "#0083D0",
    width: "auto",
    height: 55,
    backgroundColor: "white",
  },
  dropdownButtonText: {
    color: "#333",
    textAlign: "left",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginTop: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    color: "#333",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
