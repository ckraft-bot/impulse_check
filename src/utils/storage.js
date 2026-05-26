// content.js
import { getItem, setItem } from "../utils/storage.js";

const item = await getItem("pendingItem");
await setItem("pendingItem", { ...data, timestamp: Date.now() });