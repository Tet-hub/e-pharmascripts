import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  diaryContainer: {
    width: "90%",
    alignSelf: "center",
  },
  screenTitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: 600,
    marginTop: 20,
  },
  mainteNameText: {
    fontSize: 14,
    fontWeight: 500,
  },
  mainteNameView: {
    marginTop: 25,
  },
  mainteInputView: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "rgb(128, 128, 128)",
    borderRadius: 10,
  },
  placeholderStyle: {
    marginLeft: 20,
    marginVertical: 3,
  },
  stockView: {
    marginTop: 15,
  },
  medStockView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stockInputView: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "rgb(128, 128, 128)",
    borderRadius: 10,
    width: "45%",
  },
  stockPlaceholderStyle: {
    marginVertical: 1,
    textAlign: "center",
  },
  medStockText: {
    fontSize: 14,
    fontWeight: 500,
  },
  descriptionView: {
    marginTop: 15,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: 500,
  },
  descriptionInputView: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "rgb(128, 128, 128)",
    borderRadius: 10,
  },
  descriptionPlaceholderStyle: {
    marginLeft: 20,
    marginVertical: 3,
  },
  setReminderView: {
    alignItems: "center",
    backgroundColor: "#3C3C3C",
    width: "32%",
    padding: 10,
    borderRadius: 25,
  },
  setReminderNoteView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  setReminderText: {
    color: "white",
    fontSize: 14,
  },
  remindersView: {
    marginTop: 25,
    marginLeft: 10,
  },
  remindersText: {
    fontSize: 16,
    fontWeight: 500,
  },
  reminderNoteText: {
    color: "#8E8E8E",
    fontSize: 12,
    fontWeight: 400,
    marginRight: 30,
  },

  daysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
  },
  selectedDay: {
    backgroundColor: "#3C3C3C",
  },
  selectedDayText: {
    color: "white",
  },
  dayText: {
    fontSize: 13,
    color: "#3C3C3C",
  },
  //
  scheduleContainer: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 20,
    marginTop: 30,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: 400,
  },
  repetitionText: {
    color: "#EC6F56",
    fontSize: 13,
    fontWeight: 300,
    marginTop: 5,
    marginBottom: -5,
  },
  //
  selectedTimeView: {
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 20,
    padding: 10,
    height: "23%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButtonView: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#EC6F56",
    width: "100%",
    padding: 15,
    borderRadius: 25,
  },
  addText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  noRemindersText: {
    color: "#8E8E8E",
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  //
  reminderContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    elevation: 2,
    borderColor: "rgba(0, 0, 0, 0)",
    borderRadius: 20,
    padding: 15,
    width: "95%",
    alignSelf: "center",
  },
  reminderTimeText: {
    fontWeight: 400,
    fontSize: 20,
    marginLeft: 25,
    color: "#3C3C3C",
  },
  deleteIcon: {
    marginRight: 25,
  },
});

export default styles;
