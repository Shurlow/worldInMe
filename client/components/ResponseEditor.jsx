import React from 'react'
import { Editor, EditorState } from 'draft-js';
import { guid } from '../util'

export default class ResponseEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      bodyState: EditorState.createEmpty(),
      title: null
    }
    this.focusBody = () => this.refs.body.focus();
    this.onBodyChange = (bodyState) => this.setState({bodyState});
    this.onTitleChange = (e) => this.setState({ title: e.target.value });
  }



  uploadNewResponse() {
    const { user_id, story_id, username, uploadResponse } = this.props
    let responseObj = {
      id: guid(),
      title: this.state.title,
      author: username,
      author_id: user_id,
      story_id: story_id,
      content: this.state.bodyState.getCurrentContent().getPlainText()
    }
    uploadResponse(story_id, responseObj)
  }

  render() {
    // const isUploading = this.props.isUploading
    const { username, isUploading, isError} = this.props
    console.log('repsonse is', isError)
    return (
      <div className='response'>
        <div className='response-left'>
          <input placeholder='title' className='top' onChange={this.onTitleChange}></input>          
          <h4>{username}</h4>
        </div>
        <div className='response-right with-button'>
          <div onClick={this.focusBody} className="RichEditor-editor-body">
            <Editor
              editorState={ isUploading ? EditorState.createEmpty() : this.state.bodyState}
              onChange={this.onBodyChange}
              placeholder="Tell your story..."
              ref="body"
              spellCheck={true}
            />
          </div>
        </div>
        {isError ? <p className='error'>{isError}</p> : null}
        <button className='primary' onClick={this.uploadNewResponse.bind(this)}>Submit</button>
      </div>
    );
  }
}

ResponseEditor.propTypes = {
  story_id: React.PropTypes.string.isRequired,
  uploadResponse: React.PropTypes.func.isRequired
}