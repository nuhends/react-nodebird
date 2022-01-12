// 소스코드 시작부분에 넣어야 함, 하지만 next라 시작부분을 알기가 어려움..
import produce, { enableES5 } from "immer"; 

const produceWithES5 = (...args) => {
  enableES5();
  
  return produce(...args);
};

export default produceWithES5;
