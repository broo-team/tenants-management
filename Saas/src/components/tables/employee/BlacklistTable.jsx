import React, {useRef, useState} from 'react';
import {
  Badge,
  Button,
  DatePicker,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {FaFileCsv} from 'react-icons/fa6';
import { MdFilterAltOff} from 'react-icons/md';
import {CSVLink} from 'react-csv';
import {FormatDay} from '../../../helper/FormateDay';
import { Link } from 'react-router-dom';

const BlacklistTable = ({userData, loading, reload}) => {
  const [searchedColumn, setSearchedColumn] = useState ('');
  const [searchText, setSearchText] = useState ('');
  const searchInput = useRef (null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm ();
    setSearchText (selectedKeys[0]);
    setSearchedColumn (dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters ();
    setSearchText ('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={e => e.stopPropagation ()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys (e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch (selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch (selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset (clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        searchText
      ) : (
        text
      ),
  });

  const [filteredInfo, setFilteredInfo] = useState({});
  const [filteredData, setFilteredData] = useState(userData);
  
  const handleChange = (pagination, filters) => {

    let filteredInfo = filters;
    let filterData = userData;
    setFilteredInfo(filters);
  
    Object.keys(filteredInfo).forEach(key => {
  
      const value = filteredInfo[key];
  
      if(!value) return;
      
      filterData = filterData.filter(item => {  
        return value.includes(item[key]); 
      });
  
    });
  
    setFilteredData(filterData);

    console.log(filterData)
  };

  const clearAll = () => {
    setFilteredInfo({});
    setFilteredData(userData);
  };
  
  const columns = [
    {
      title: 'IDNO',
      dataIndex: 'IDNO',
      ...getColumnSearchProps ('IDNO'),
      width: '80px',
      fixed:'left',
      key: 'IDNO',
      render: r => (
        <Tooltip title='View Detail'
        >
          <Link to={`/employee/detail/${r}`}>
            {r}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: 'Employee Info',
      children: [
        {
          title: 'Full Name',
          children: [
            {
              title: 'First',
              dataIndex: 'fName',
              ...getColumnSearchProps ('fName'),
              width: '90px',
              key: 'fName',
            },
            {
              title: 'Middle',
              dataIndex: 'mName',
              ...getColumnSearchProps ('mName'),
              width: '90px',
              key: 'mName',
            },
            {
              title: 'Last',
              dataIndex: 'lName',
              ...getColumnSearchProps ('lName'),
              width: '90px',
              key: 'lName',
            },
            ,
          ],
        },
        {
          title: 'Sex',
          dataIndex: 'sex',
          key: 'sex',
          width: '80px',
          filters: [
            {
              text: 'Male',
              value: 'Male',
            },
            {
              text: 'Female',
              value: 'Female',
            },
          ],
          filteredValue: filteredInfo.sex || null,
          onFilter: (value, record) => record.sex.includes(value),
        },
      ],
    },
    {
      title: 'Work Info',
      children: [
        {
          title: 'Branch',
          dataIndex: 'branch',
          width: '100px',
          key: 'branch',
          filters: [
            {
              text: 'Arada Adwa',
              value: 'Arada Adwa',
            },
          ],
          filteredValue: filteredInfo.branch || null,
          onFilter: (value, record) => record.branch.includes(value),
        },
        {
          title: 'Department',
          dataIndex: 'department',
          width: '120px',
          key: 'department',
          filters: [
            {
              text: 'Security',
              value: 'Security',
            },
          ],
          filteredValue: filteredInfo.department || null,
          onFilter: (value, record) => record.department.includes(value),
        },
        {
          title: 'Position',
          dataIndex: 'position',
          width: '100px',
          key: 'position',
          filters: [
            {
              text: 'Security Guard',
              value: 'Security Guard',
            },
          ],
          filteredValue: filteredInfo.position || null,
          onFilter: (value, record) => record.position.includes(value),
        },],},
    {
      title: 'Incidents',
      dataIndex: 'incidents',
      width:'150px',
      key: 'incidents',
      render: r => (
        <Space style={{display:'flex',flexWrap:'wrap',width:'100%'}}>
        <Tag color={r === 'Active' ? 'success' : 'error'}>Abuse of Authority</Tag>
        <Tag color={r === 'Active' ? 'success' : 'error'}>Drinking</Tag>
        <Tag color={r === 'Active' ? 'success' : 'error'}>Theft</Tag>
        </Space>
      ),
    },
    {
      title: 'Magnitude',
      dataIndex: 'incidentMagnitude',
      width: '100px',
      key: 'incidentMagnitude',
      render: r => (
        <Tag
          color={r === 'Active' ? 'success' : 'error'}
        >High</Tag>
      ),
    },
    {
      title: 'Report Date',
      dataIndex: 'registered',
      width: '150px',
      key: 'registered',
      render: r => <span>{FormatDay(r)}</span>,
    },
    {
      fixed: 'right',
      title: 'Status',
      width: '80px',
      key: 'status',
      filters: [
        {
          text: 'Pending',
          value: 'Pending',
        },
        {
          text: 'Guilty',
          value: 'Guilty',
        },
        {
          text: 'Inocent',
          value: 'Inocent',
        },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      render: r => (
        <Tag
          color={r.status === 'Pending' ? 'success' : 'error'}
        >Guilty</Tag>
      ),
    },
    {
      title: 'Action',
      width: '70px',
      fixed: 'right',
      key: 'operation',
      render: r => (
        <Tooltip title='View Detail'
        >
          <Link to={`/blacklist/detail/${r.IDNO}`}>
            Detail
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div style={{display:'flex',width:"100%",gap:'5px',marginBottom:"5px",justifyContent:'flex-end'}}>
      <CSVLink
        data={filteredData}
        filename={"employee-detail-csv"}>
          <Button><FaFileCsv/>CSV</Button>
      </CSVLink>
      <Button onClick={clearAll}><MdFilterAltOff/> Clear filters</Button>
      </div>
      <Table
      size="small"
      columns={columns}
      bordered
      scroll={{
        x: 500,
      }}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
      }}
      dataSource={userData}
      onChange={handleChange}
      loading={loading}
    />
    </div>
  );
};
export default BlacklistTable;