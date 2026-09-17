import MinimalistTemplate from "./MinimalistTemplate";
import CyberpunkTemplate from "./CyberpunkTemplate";
import CorporateTemplate from "./CorporateTemplate";

const templateMap = {
  minimalist: MinimalistTemplate,
  cyberpunk: CyberpunkTemplate,
  corporate: CorporateTemplate,
};

export const DefaultLayout = MinimalistTemplate;

export default templateMap;
