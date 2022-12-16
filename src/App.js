import axios from 'axios';
import * as cheerio from 'cheerio';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const REQUEST_URL = '/clip/hsinfosrch/openULS0201005Q.do';
const LAST_COLUMN_INDEX = 5;
const COLUMN_NAMES = [
  'itemNumber1',
  'itemNumber2',
  'itemNumber3',
  'korean',
  'english',
  'rate'
];

const App = () => {
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);

  const getItems = useCallback(async () => {
    setItems([]);

    const { data } = await axios.post(`${REQUEST_URL}?cntyCd=KR&searchVal=${itemName}`);
    const $ = cheerio.load(data);
    const tableRows = $('#tblLstBody tr');

    tableRows.forEach((_, row) => {
      const $row = $(row);
      const columns = $row.find('td');

      const item = {};
      for (let i = 0; i <= LAST_COLUMN_INDEX; i++) {
        const $column = $(columns[i]);
        const text = $column.find('a').text();
        item[COLUMN_NAMES[i]] = text;
      }

      setItems(prevItems => [...prevItems, item]);
    });
  }, [itemName]);

  return (
    <Container>
      <Section>
        <Label>Item name:</Label>
        <Input value={itemName} onChange={event => setItemName(event.target.value)} />
        <button onClick={getItems}>Submit</button>
      </Section>

      <Section>
        <table>
          <thead>
            <tr>
              <th>품목번호 1</th>
              <th>품목번호 2</th>
              <th>품목번호 3</th>
              <th>한글</th>
              <th>영문</th>
              <th>기본 세율</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={`item-${index}`}>
                <td>{item.itemNumber1}</td>
                <td>{item.itemNumber2}</td>
                <td>{item.itemNumber3}</td>
                <td>{item.korean}</td>
                <td>{item.english}</td>
                <td>{item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>



      </Section>
    </Container>
  );
};

const Container = styled.div`
  width: 800px;
  height: 800px;
  margin: auto;
  padding: 80px;
  text-align: center;;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  margin-right: 8px;
`;

const Input = styled.input`
  margin-right: 8px;
`;

export default App;
