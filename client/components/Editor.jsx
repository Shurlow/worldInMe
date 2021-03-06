import React from 'react'
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState} from 'draft-js';
import backdraft from 'backdraft-js';
import TagSelect from './TagSelect'
import ArticleWithBg from './ArticleWithBg'

class CustomEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: EditorState.createEmpty()
    }
    this.focusBody = () => this.refs.body.focus();
    this.focusTitle = () => this.refs.title.focus();
    this.focusAuthor = () => this.refs.author.focus();
    this.updateTags =(tag, value) => { this.props.updateNewStory({ [tag]: value })}
    this.onTitleChange = (e) => this.props.updateNewStory({title: e.target.value});
    this.onAuthorChange = (e) => this.props.updateNewStory({author: e.target.value});
  }

  uploadContent() {
    this.props.uploadStory()
  }

  onBodyChange(body) {
    this.setState({body})
    const markup = {
      'BOLD': ['<strong>', '</strong>'],
      'ITALIC': ['<em>', '</em>'],
      'UNDERLINE': ['<u>', '</u>']
    };
    const contentState = body.getCurrentContent()
    const raw = convertToRaw(contentState)
    const content = backdraft(raw, markup)
    this.props.updateNewStory({content: content})
  }

  render() {
    const { body } = this.state;
    return (
      <ArticleWithBg className='editor'>
        <header className="center">
          <div onClick={this.focusTitle} className="title">
            <input placeholder="title" ref='title' onChange={this.onTitleChange.bind(this)}/>
          </div>
          <div onClick={this.focusAuthor} className="name">
            <h3> Produced by
              <input placeholder="author" ref='author' onChange={this.onAuthorChange.bind(this)}/>
            </h3>
          </div>
          <h3>Directed by <span className='name'>{this.props.author}</span></h3>
        </header>
        <div className='large-card body'>
          <div onClick={this.focusBody} className="RichEditor-editor-body">
            <Editor
              editorState={body}
              onChange={this.onBodyChange.bind(this)}
              placeholder="Tell your story..."
              ref="body"
              spellCheck={true}
            />
          </div>
        </div>
        <div className='story-sidebar'>
          <TagSelect updateTags={this.updateTags.bind(this)} />
        </div>
      </ArticleWithBg>
    );
  }
}

CustomEditor.propTypes = {
  // uploadStory: React.PropTypes.func.isRequired,
  id: React.PropTypes.string.isRequired
}

export default CustomEditor