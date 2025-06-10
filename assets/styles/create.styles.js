// styles/create.styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  backButton: {
    padding: 5,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
  },
  typeIcon: {
    marginRight: 8,
  },
  typeButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIconWrapper: {
    backgroundColor: '#f1f1f1',
    borderRadius: 999,
    padding: 6,
    marginRight: 6,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryButtonText: {
    color: COLORS.text,
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 20,
},

categoryButton: {
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: '#f1f1f1',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ccc',
},

categoryButtonActive: {
  backgroundColor: COLORS.primary,
  borderColor: COLORS.primary,
},

categoryButtonText: {
  fontSize: 14,
  color: '#333',
},

categoryButtonTextActive: {
  color: '#fff',
},

amountContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginBottom: 20,
},

currencySymbol: {
  fontSize: 16,
  color: '#666',
  marginRight: 8,
},

amountInput: {
  flex: 1,
  fontSize: 16,
  color: '#000',
},

});
