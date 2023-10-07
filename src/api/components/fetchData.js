import axios from "axios";
import { BASE_URL, EMU_URL } from "../apiURL";

export const getData = async (collectionName) => {
  try {
    const response = await axios.get(
      `${EMU_URL}/api/mobile/get/data/${collectionName}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
