
/**
 * ? Q. JSON 파일을 아래의 5, 6번에 해당하는 로직 작성 후 JSON으로 저장
 * ? Q. 저장이 완료되면 초기화된 result에 객체를 리턴
 *
 * * 1. inputJSONdata, outputJSONdata를 읽어서 JSON 객체로 변환
 * * 2. inputJSONdata, outputJSONdata의 value를 비교
 * * 3. outputJSONpath 매개변수의 key에 해당하는 정보를 저장
 * * 4. dirrences.json 파일에 필요한 상태값
 * * 5. 같은 단어가 무엇인지 저장
 * * 6. 다른 단어가 무엇인지 저장
 * * 7. 리턴을 통해 결과값을 전달
 */ 

// fs 불러오기
import fs from "fs";

// 문자열에서 특수 문자를 제거하는 함수
function removeSpecialCharacters(str) {
  // map() : 함수를 호출한 결과를 모아 새로운 배열을 반환
  return str.match(/[A-Za-z0-9가-힣]+/g).map((word) => word.toLowerCase());
}

export default function (inputJSONPath, outputJSONPath) {
  // 확장자가 .json인지 확인
  // endsWith(): 특정 문자열로 끝나는지를 확인
  if (!inputJSONPath.endsWith(".json") || !outputJSONPath.endsWith(".json")) {
    throw new Error(
      `매개변수 ${inputJSONPath}, ${outputJSONPath}는 json 파일이 아닙니다.`
    );
  }

  // JSON 파일을 읽어오기
  const inputJSONData = fs.readFileSync(inputJSONPath, "utf8");
  const outputJSONData = fs.readFileSync(outputJSONPath, "utf8");
  // JSON 데이터로 파싱
  const inputJSON = JSON.parse(inputJSONData);
  const outputJSON = JSON.parse(outputJSONData);

  // inputJSON의 operator, operand 프로퍼티 값 가져오기
  const operator = removeSpecialCharacters(inputJSON.operator);
  const operand = removeSpecialCharacters(inputJSON.operand);

  const commonWords = [];
  const differentWords = [];

  // operator와 operland 단어 비교하여 공통 단어 찾기
  for (const word1 of operator) {
    if (operand.includes(word1)) {
      commonWords.push(word1);
    }
  }

  // operland와 operator의 차집합을 계산하여 다른 단어 찾기
  // Set 객체를 사용해서 중복된 단어가 제거되고, 각각 operand와 operator 배열의 고유한 단어만 남김
  const operandSet = new Set(operand);
  const operatorSet = new Set(operator);

  // operand 배열에서 operatorSet에 존재하지 않는 단어만 필터링
  const differentOperandWords = operand.filter(
    (word) => !operatorSet.has(word)
  );

  // operator 배열에서 operandSet에 존재하지 않는 단어만 필터링
  const differentOperatorWords = operator.filter(
    (word) => !operandSet.has(word)
  );

  // differentOperlandWords와 differentOperatorWords 배열을 differentWords에 모두 추가
  differentWords.push(...differentOperandWords, ...differentOperatorWords);

  // 결과 객체 생성
  const result = {
    commonWords,
    differentWords,
  };

  // 결과 객체를 JSON 문자열로 변환
  const resultsJSON = JSON.stringify(result, null, 2);

  // 결과 JSON 문자열을 출력 JSON 파일에 저장
  fs.writeFileSync(outputJSONPath, resultsJSON, "utf8");

  // 결과 객체 반환
  return result;
}
