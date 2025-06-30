import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { Formik } from "formik";
import { addCustomer } from "../../database";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

const DynamicSelectField = ({
  label,
  name,
  handleChange,
  items,
  errors,
  resetField,
}) => (
  <View style={styles.row}>
    <View style={styles.fieldContainer}>
      <SelectDropdown
        data={items}
        onSelect={(selectedItem, index) => {
          handleChange(name)(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        error={errors[name] ? true : false}
        defaultButtonText={`انتخاب ${label}`}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownButtonText}
        dropdownStyle={styles.dropdown}
        dropdownTextStyle={styles.dropdownItem}
        rowTextStyle={styles.dropdownItemText}
        key={resetField}
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

const AddCustomer = () => {
  const [resetFields, setResetFields] = useState(false);
  const [jeebTunbanChecked, setJeebTunbanChecked] = useState(false);
  const [yakhanBinChecked, setYakhanBinChecked] = useState(false);
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
  const currentDate = getCurrentDate();

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
    "ساده بردار مثلث",
    "میژدار",
    "کف فلیټ دار",
    "کف میژدار",
  ];
  const selectJeeb = ["2 جیب بغل 1 پیشرو", "2 جیب بغل"];
  const selectTunbanStyle = ["تنبان آزاد", "تنبان متوسط", "تنبان بلوچی"];

  const saveCustomer = async (values, resetForm) => {
    const currentDate = getCurrentDate();

    try {
      const resultSet = await addCustomer(
        "INSERT INTO customer (name, phoneNumber, qad, barDaman, baghal, shana, astin, tunban, pacha, yakhan, yakhanValue, yakhanBin, farmaish, daman, caff, caffValue, jeeb, tunbanStyle, jeebTunban, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          values.name,
          values.phoneNumber,
          values.qad,
          values.barDaman,
          values.baghal,
          values.shana,
          values.astin,
          values.tunban,
          values.pacha,
          values.yakhan,
          values.yakhanValue,
          yakhanBinChecked ? 1 : 0,
          values.farmaish,
          values.daman,
          values.caff,
          values.caffValue,
          values.jeeb,
          values.tunbanStyle,
          jeebTunbanChecked ? 1 : 0,
          currentDate,
        ]
      );

      // The operation was successful if we get here
      console.log("Customer added successfully with ID:", resultSet?.insertId);
      ToastAndroid.show("مشتری موفقانه اضافه شد!", ToastAndroid.SHORT);
      resetForm();
      setResetFields(!resetFields);
      setJeebTunbanChecked(false);
      setYakhanBinChecked(false);
    } catch (error) {
      console.error("Error inserting customer:", error);
      ToastAndroid.show("خطا در ذخیره سازی معلومات!", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{
          name: "",
          phoneNumber: "",
          qad: "",
          barDaman: "",
          baghal: "",
          shana: "",
          astin: "",
          tunban: "",
          pacha: "",
          yakhan: "",
          yakhanValue: "",
          yakhanBin: "",
          farmaish: "",
          daman: "",
          caff: "",
          caffValue: "",
          jeeb: "",
          tunbanStyle: "",
          jeebTunban: "",
        }}
        validationSchema={validationSchema}
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
                  label="یخن"
                  name="yakhan"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.yakhan}
                  items={selectYakhan}
                  errors={errors}
                  resetField={resetFields}
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
                  status={yakhanBinChecked ? "checked" : "unchecked"}
                  onPress={() => setYakhanBinChecked(!yakhanBinChecked)}
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
                  label="آستین"
                  name="caff"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.caff}
                  items={selectCaff}
                  errors={errors}
                  resetField={resetFields}
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
                  label="دامن"
                  name="daman"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.daman}
                  items={selectDaman}
                  errors={errors}
                  resetField={resetFields}
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
                  label="تنبان"
                  name="tunbanStyle"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.tunbanStyle}
                  items={selectTunbanStyle}
                  errors={errors}
                  resetField={resetFields}
                />
              </View>
            </View>

            <View style={styles.fieldContainer2}>
              <View style={styles.fieldContainer}>
                <DynamicSelectField
                  label="جیب"
                  name="jeeb"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.jeeb}
                  items={selectJeeb}
                  errors={errors}
                  resetField={resetFields}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Checkbox.Item
                  label="جیب تنبان"
                  status={jeebTunbanChecked ? "checked" : "unchecked"}
                  onPress={() => setJeebTunbanChecked(!jeebTunbanChecked)}
                  labelStyle={styles.checkboxLabel}
                  color="#0083D0" // Change checkbox color
                  uncheckedColor="#0083D0" // Change unchecked checkbox color
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

            <View style={styles.fieldContainer2}>
              <View style={styles.fieldContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>اضافه کردن مشتری</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
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
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  checkbox: {
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderColor: "#0083D0",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: 55,
    width: "auto",
  },
  button: {
    backgroundColor: "#0083D0",
    borderRadius: 5,
    paddingVertical: 17,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddCustomer;
