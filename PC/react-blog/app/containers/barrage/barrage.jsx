import { actions } from './../../redux/actionCreators';
import { Input, Button } from 'antd';

const React = require('react');
const { connect } = require('react-redux');

const InputGroup = Input.Group;

class Barrage extends React.Component {
  render() {
    const { input, AddBarrage, updateInput } = this.props;

    return (
      <InputGroup className="barrage-input-group" compact>
        <Input
          id="barrage-input"
          placeholder="嗨~这里可以输入弹幕哦~ (*^_^*)"
          allowClear
          onChange={e => updateInput(e.target.value)}
          value={input}
          style={{ width: '45%', maxWidth: '270px' }}
          onPressEnter={AddBarrage}
        />
        <Button
          id="barrage-btn"
          style={{ width: '88px' }}
          onClick={AddBarrage}
        >发送弹幕</Button>
      </InputGroup>
    )
  }
}

function mapStateToProps(state) {
  return {
    input: state.input
  }
}

function mapDispatchToProps(dispatch) {
  return {
    AddBarrage: () => dispatch(actions.addBarrage()),
    updateInput: (value) => dispatch(actions.updateInput(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Barrage);