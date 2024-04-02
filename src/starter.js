import * as d3 from "d3"; //d3 가져오기
import "./viz.css"; //스타일링 첨부

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
//변수설정
//html에 svg container에 있던 id 가져오기, id 정의

let width = parseInt(d3.select("#svg-container").style("width"));
//parseInt=어떤 값을 정수로 바꿔 리턴
//svg-container의 style인 width를 가져와라
let height = parseInt(d3.select("#svg-container").style("height"));
console.log(height); //제대로 나오나 확인

const margin = { top: 6, right: 30, bottom: 60, left: 50 }; //svg 설정 끝

// parsing & formatting
const parseTime = d3.timeParse("%Y-%m-%dT00:00:00Z");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
//그래프 위치 정하기

// axis

// line
const line = d3
  .line()
  .x((d) => xScale(d.date_parsed))
  .y((d) => yScale(d.price));

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)
let data = [];

d3.json("data/bitcoin-data.json").then((raw_data) => {
  //json 비트코인 파일 불러오기->그리고 이걸 해라(원시데이터로 뭔가를 할거임)
  //   console.log(raw_data);

  data = raw_data.map((d) => {
    // console.log(d));

    d.date_parsed = parseTime(d.timestamp);
    return d;
  });

  console.log(data);

  xScale.domain(d3.extent(data, (d) => d.date_parsed));
  yScale.domain(d3.extent(data, (d) => d.price));

  console.log(d3.extent(data, (d) => d.price));

  svg
    .append("path")
    .datum(data) //라인차트니까
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "blue");

  const area = d3
    .area()
    .x((d) => xScale(d.date_parsed))
    .y0(height - margin.bottom)
    .y1((d) => yScale(d.price));

  svg
    .append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
    .attr("fill", "blue");
});
