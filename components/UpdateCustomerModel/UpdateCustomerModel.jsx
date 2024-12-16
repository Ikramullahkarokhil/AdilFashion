import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Modal,
  ToastAndroid,
} from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { Formik } from "formik";
import db from "../../Database";
import * as NavigationBar from "expo-navigation-bar";

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
      />
    </View>
  );
};

const UpdateCustomerModel = ({ customerData, onClose, visible }) => {
  const [jeebTunban, setJeebTunban] = useState(false);
  const [yakhanBin, setYakhanBin] = useState(false);
  const customerId = customerData.id;
  NavigationBar.setBackgroundColorAsync("#F2F5F3");

  useEffect(() => {
    if (customerData) {
      setJeebTunban(customerData.jeebTunban === 1);
      setYakhanBin(customerData.yakhanBin === 1);
    }
  }, [customerData]);

  const initialValues = {
    name: customerData?.name || "",
    phoneNumber: customerData?.phoneNumber?.toString() || "",
    qad: customerData?.qad?.toString() || "",
    barDaman: customerData?.barDaman?.toString() || "",
    baghal: customerData?.baghal?.toString() || "",
    shana: customerData?.shana?.toString() || "",
    astin: customerData?.astin?.toString() || "",
    tunban: customerData?.tunban?.toString() || "",
    pacha: customerData?.pacha?.toString() || "",
    yakhan: customerData?.yakhan || "",
    yakhanValue: customerData?.yakhanValue?.toString() || "",
    farmaish: customerData?.farmaish || "",
    daman: customerData?.daman || "",
    caff: customerData?.caff || "",
    caffValue: customerData?.caffValue?.toString() || "",
    jeeb: customerData?.jeeb || "",
    tunbanStyle: customerData?.tunbanStyle || "",
    jeebTunban,
    yakhanBin,
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

  const selectYakhan = [
    "یخن ګلدوزی",
    "یخن هندی",
    "قاسمی",
    "یخن هفت",
    "یخن ګول",
    "یخن عربی",
    "کټ بین",
    "ساده بین",
    "ترکی بین",
    "کالر",
    "ګول کالر",
  ];

  const selectDaman = ["ګول", "چهار کنج", "ترخزی", "2 ترخزی", "دامن بردار"];
  const selectCaff = [
    "چسف کف",
    "ګول کف",
    "ډبل کف",
    "ساده",
    "ساده بردار",
    "ساده بردار مسلس",
    "میژدار",
    "کف فلیټ دار",
    "کف میژدار",
  ];
  const selectJeeb = ["2 جیب بغل 1 پیشرو", "2 جیب بغل"];
  const selectTunbanStyle = ["تنبان آزاد", "تنبان متوسط", "تنبان بلوچی"];

  const saveCustomer = (values, resetForm) => {
    const newJeebTunban = jeebTunban ? 1 : 0;
    const newYakhanBin = yakhanBin ? 1 : 0;
    const currentDate = getCurrentDate();

    const {
      name,
      phoneNumber,
      qad,
      barDaman,
      baghal,
      shana,
      astin,
      tunban,
      pacha,
      yakhan,
      yakhanValue,
      farmaish,
      daman,
      caff,
      caffValue,
      jeeb,
      tunbanStyle,
    } = values;

    db.transaction(
      (tx) => {
        tx.executeSql(
          `
          UPDATE customer
          SET 
            name = ?,
            phoneNumber = ?,
            qad = ?,
            barDaman = ?,
            baghal = ?,
            shana = ?,
            astin = ?,
            tunban = ?,
            pacha = ?,
            yakhan = ?,
            yakhanValue = ?,
            yakhanBin = ?,
            farmaish = ?,
            daman = ?,
            caff = ?,
            caffValue = ?,
            jeeb = ?,
            tunbanStyle = ?,
            jeebTunban = ?,
            regestrationDate = ?
          WHERE id = ?
          `,
          [
            name,
            phoneNumber,
            qad,
            barDaman,
            baghal,
            shana,
            astin,
            tunban,
            pacha,
            yakhan,
            yakhanValue,
            newYakhanBin,
            farmaish,
            daman,
            caff,
            caffValue,
            jeeb,
            tunbanStyle,
            newJeebTunban,
            currentDate,
            customerId,
          ],
          (_, result) => {
            console.log("Customer updated successfully:");
            ToastAndroid.show(
              "مشتری موفقانه به روز رسانی شد!",
              ToastAndroid.SHORT
            );
            resetForm();
            onClose();
          },
          (_, error) => {
            console.log("Error updating customer:", error);
            // Handle error here
          }
        );
      },
      (error) => {
        console.log("Transaction error:", error);
        // Handle transaction error here
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => saveCustomer(values, resetForm)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.form}>
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
                  <DynamicSelectField
                    label={values.yakhan}
                    name="yakhan"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.yakhan} // Pass the value for the yakhan field
                    items={selectYakhan}
                    errors={errors}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="بر دامن"
                    name="barDaman"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.barDaman}
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
                  <Checkbox.Item
                    label="بن دار"
                    status={yakhanBin ? "checked" : "unchecked"}
                    onPress={() => {
                      setYakhanBin(!yakhanBin);
                    }}
                    labelStyle={styles.checkboxLabel}
                    color="#0083D0"
                    uncheckedColor="#0083D0"
                    style={styles.checkbox}
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
                  <DynamicSelectField
                    label={values.caff}
                    name="caff"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.caff}
                    items={selectCaff}
                    errors={errors}
                  />
                </View>
              </View>
              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="آستین"
                    name="astin"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.astin}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label={`اندازه ${values.caff}`}
                    name="caffValue"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.caffValue}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="تنبان"
                    name="tunban"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.tunban}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <DynamicSelectField
                    label={values.jeeb}
                    name="jeeb"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.jeeb}
                    items={selectJeeb}
                    errors={errors}
                  />
                </View>
              </View>
              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="پاچه"
                    name="pacha"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.pacha}
                    errors={errors}
                    keyboard="numeric"
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <DynamicSelectField
                    label={values.tunbanStyle}
                    name="tunbanStyle"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.tunbanStyle}
                    items={selectTunbanStyle}
                    errors={errors}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer2}>
                <View style={styles.fieldContainer}>
                  <DynamicSelectField
                    label={values.daman}
                    name="daman"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.daman}
                    items={selectDaman}
                    errors={errors}
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <Checkbox.Item
                    label="جیب تنبان"
                    status={jeebTunban ? "checked" : "unchecked"}
                    onPress={() => {
                      setJeebTunban(!jeebTunban);
                    }}
                    labelStyle={styles.checkboxLabel}
                    color="#0083D0"
                    uncheckedColor="#0083D0"
                    style={styles.checkbox}
                  />
                </View>
              </View>
              <View style={[styles.fieldContainer2, { marginTop: 10 }]}>
                <View style={styles.fieldContainer}>
                  <DynamicInputField
                    label="فرمایشات"
                    name="farmaish"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.farmaish}
                    errors={errors}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button mode="outlined" onPress={onClose}>
                  Cancel Update
                </Button>
                <Button mode="contained" onPress={handleSubmit}>
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F5F3",
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
    borderColor: "black",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  checkboxLabel: {
    fontSize: 16,
    color: "#333", // Change label color
  },
  checkbox: {
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderColor: "black",
    borderRadius: 5,
    height: 55,
    width: "auto",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default UpdateCustomerModel;
