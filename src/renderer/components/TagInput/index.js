import React, { Component } from "react";
import "./index.less";

import { Tag, Input, Tooltip, Icon } from "antd";

class TagInput extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: ""
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    if (typeof  this.props.dataCB === 'function') {
      this.props.dataCB(tags);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ""
    });
    if (typeof  this.props.dataCB === 'function') {
      this.props.dataCB(tags);
    }
  };

  saveInputRef = input => (this.input = input);

  componentDidMount() {
    this.setState({
      tags: this.props.suffix || [".js", ".html", ".css"]
    });
  }

  componentWillReceiveProps(p) {
    this.setState({
      tags: p.suffix || [".js", ".html", ".css"]
    });
  }

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={true}
              onClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <Icon type="plus" /> New Suffix
          </Tag>
        )}
      </div>
    );
  }
}

export default TagInput;
