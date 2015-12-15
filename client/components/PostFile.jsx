import React from 'react'
import Link from 'react-router'
import Editor from './Editor.jsx'
import request from 'superagent'
import classnames from 'classnames'
// import ImageBlurLoader from '../../../react-imageblurloader/src/ImageBlurLoader.js'
var btnClass, btnClass2, storyClass;

class PostFile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: "...",
      author_name: "author",
      title: "Title",
      img: "/img/testbigimg.png",
      editMode: false,
    }
  }

  //Helper function that pushes Editor components to update state manually
  //pretty much use once for api update
  pushState() {
    this.titleref.update(this.state.title)
    this.authref.update(this.state.author_name)
    this.textref.update(this.state.text)
  }

  componentDidMount() {
    var self = this
    request
      .get('http://localhost:3000/api/' + this.props.params.id)
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        self.setState({
          text: res.body.text,
          author_name: res.body.author_name,
          title: res.body.title,
          img: res.body.img,
        })
        self.pushState()
      })
  }

  handleTitleChange(value) {
    this.setState({
      title: value
    })
  }
  handleNameChange(value) {
    this.setState({
      author_name: value
    })
  }
  handleTextChange(value) {
    this.setState({
      text: value
    })
  }

  handleImgChange(e) {
    this.setState({
      img: e.target.value
    })
  }


  togleEditMode(e) {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  saveEdits(e) {
    console.log('Saving your work...', this.state)
    request
      .post('http://localhost:3000/api/update/' + this.props.params.id)
      .set('Content-Type', 'application/json')
      .send(this.state)
      .end(function(err, res) {
        if (err) return alert('Big Error!')
        alert('Story Saved')
      })
  }

  handleFocus() {
    console.log('onFocus');
  }

  handleBlur() {
    console.log('onBlur');
  }

  // handleChange(text, medium) {
  //   this.setState({
  //     text: text
  //   });
  // },

  defineClasses() {
    // btnClass = classnames({
    //   'clicked': this.state.editMode,
    // });
    
    // btnClass2 = classnames({
    //   'visible': this.state.editMode,
    //   'slidebutton': true,
    // });
    
    storyClass = classnames({
      'story': true,
      'editing': this.state.editMode,
    });
  }

  render() {
    console.log('render story', this.state)
    this.defineClasses()
    return (
      <div>
        <div id="fleximg">
          <img className="leadimg" src={this.state.img}></img>
          </div>
        <div className={storyClass}>
          <h2>Upload your story here:</h2>
          <h3>formats: .word .txt .rtf</h3>
        </div>
        
      </div>
    )
  }

}

export default PostFile