import Separate from 'components/common/Separate';

const { Popconfirm, Icon, Tooltip } = window.antd;

export const createColumns = ({ handleDelete, hideActPercent }) => {
  const columns = [
    {
      title: '工作内容',
      dataIndex: 'content',
      editable: true,
      type: 'textarea', // 输入控件类型
      width: '40%',
      textWrap: 'word-break',
      rules: [ // 规则
        {
          required: true,
          message: `请输入`,
          whitespace: true
        },
      ],
      componentProps: { // 输入控件属性
        maxLength: 100,
        placeholder: '请输入工作内容，最多100字',
        autosize: { minRows: 3 }
      },
      render(t) {
        return t
          ? <span dangerouslySetInnerHTML={{ __html: T.return2Br(t) }}></span>
          : <span style={{color: '#d8d3d3'}}>请输入工作内容，最多100字</span>;
      }
    },
    {
      title: (<div>
        预期
        <Separate size={3} isVertical={false} />
        <Tooltip title={`此任务预估在${hideActPercent ? '下' : '本'}周可实现的进度`}>
          <Icon type="question-circle" />
        </Tooltip>
      </div>),
      dataIndex: 'expectedCompletionPercentage',
      editable: true,
      width: 100,
      align: 'center',
      type: 'numberInput',
      rules: [
        {
          type: 'number',
          required: true,
          message: `请输入`,
          whitespace: true
        },
        {
          type: 'number',
          min: 0,
          max: 100,
          message: `请输入0-100的正整数`,
        },
      ],
      componentProps: {
        suffix: '%',
        pattern: /^(?:0|[1-9][0-9]?|100)$/,
      },
      render(p) {
        return (typeof p !== 'undefined')
        ? `${p}%`
        : <span style={{color: '#d8d3d3'}}>请输入</span>;
      }
    },
    hideActPercent
      ? null
      : {
          title: (<div>
            实际
            <Separate size={3} isVertical={false} />
            <Tooltip title="此任务在本周实际实现的进度">
              <Icon type="question-circle" />
            </Tooltip>
          </div>),
          dataIndex: 'actualCompletionPercentage',
          editable: true,
          width: 100,
          align: 'center',
          type: 'numberInput',
          rules: [
            {
              type: 'number',
              required: true,
              message: `请输入`,
              whitespace: true
            },
            {
              type: 'number',
              min: 0,
              max: 100,
              message: `请输入0-100的正整数`,
            },
          ],
          componentProps: {
            suffix: '%',
            pattern: /^(?:0|[1-9][0-9]?|100)$/,
          },
          render(p) {
            return (typeof p !== 'undefined')
            ? `${p}%`
            : <span style={{color: '#d8d3d3'}}>请输入</span>;
          }
        },
    {
      title: '备注说明',
      dataIndex: 'memo',
      editable: true,
      type: 'textarea',
      align: 'center',
      textWrap: 'word-break',
      componentProps: {
        maxLength: 1000,
        placeholder: '请输入主要问题，最多1000字',
        autosize: { minRows: 3 }
      },
      render(t) {
        return t
          ? <div dangerouslySetInnerHTML={{ __html: T.return2Br(t) }}></div>
          : <span style={{color: '#d8d3d3'}}>请输入主要问题，最多1000字</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      align: 'center',
      render: (text, record) =>
        (
          <Popconfirm title="删除?" onConfirm={() => handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        )
    },
  ];

  return columns.filter(Boolean);
};

