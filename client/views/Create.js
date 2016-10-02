import React from 'react'
import ImageUploader from '../components/ImageUploader.jsx'
import classnames from 'classnames'
import { uploadStory, uploadImage } from "../actions"
import CustomEditor from '../components/Editor'
import { guid } from '../util.js'
import {connect} from "react-redux"

class Create extends React.Component {

  constructor(props) {
    super(props)
  }

  pushImageUpload(imgData) {
    this.props.uploadImage(this.props.id, imgData)
  }

  saveStory(storyObj) {
    this.props.uploadStory(storyObj)
  }

  addImage() {
    if (this.props.imageSuccess) {
      return "https://s3-us-west-2.amazonaws.com/worldinme-full/" + this.props.id + ".jpg?t=" + new Date().getTime()
    } else {
      return 'res/uploadimg.png'
    }
  }

  addVideo() {
    
  }
// <ImageUploader src={this.fingImageSrc()}pushImageUpload={this.pushImageUpload.bind(this)}/>
  render() {
    return (
      <div className='content'>
        <div>
          <button className='' onClick={this.addImage.bind(this)}>Add Image</button>
          <button className='' onClick={this.addVideo.bind(this)}>Add Video</button>
        </div>
        <div className="mw6 center bg-white active_shadow pa4">
          <CustomEditor id={this.props.id} pushStoryUpload={this.saveStory.bind(this)}/>
        </div>
      </div>
    )
  }
}

// export default Create

Create.defaultProps = {
  id: guid()
}

const mapStateToProps = (state) => ({
  isFetching: state.data.isFetching,
  username: state.auth.username,
  imageSuccess: state.data.imageSuccess
});

export default connect(mapStateToProps, {
  uploadStory,
  uploadImage
})(Create)
