import React, { Component } from 'react';
import EXIF from 'exif-js'
import './App.css';

var imgs = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"]

class PhotoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: '', files: []}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value, files: Array.from(event.target.files)})
    console.log(Array.from(event.target.files))
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log('form submitted.')
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            File(s): 
            <input type="file" multiple value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.files ? this.state.files.map((item, index) =>
            <Photo imageUrl={URL.createObjectURL(item)} key={index} />)
            : null
        }
        </div>
      )
  }
}

class PhotoPopup extends Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-inner">
          <img src={this.props.imageUrl} style={{width: '100%'}} />
          <button onClick={this.props.closePopup}>close</button>
        </div>
      </div>
      )
  }
}

class Photo extends Component {
  constructor(props) {
    super(props)

    this.imgRef = React.createRef()

    this.handleOnLoad = this.handleOnLoad.bind(this)
    this.togglePopup = this.togglePopup.bind(this)

    this.state = {
      aperture: 0,
      shutterSpeed: 0.0,
      iso: 0.0,
      showPopup: false,
    }
  }

  updateState() {
    const img = this.imgRef.current
    var self = this

    EXIF.getData(img, function() {
      console.log(JSON.stringify(EXIF.getAllTags(this), null, '\t'))
      var aperture = EXIF.getTag(this, 'FNumber')
      var shutterSpeed = EXIF.getTag(this, 'ExposureTime')
      var sens = EXIF.getTag(this, 'ISOSpeedRatings')
      var state = {aperture: aperture.toString(), shutterSpeed: shutterSpeed.toString(), iso: sens.toString()}

      self.setState(state)
    })
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    })
  }

  handleOnLoad() {
    this.updateState()
  }

  render() {
    return (
      <div>
        <img onLoad={this.handleOnLoad} ref={this.imgRef} src={this.props.imageUrl} style={{width: 400}} />
        <span ref={this.descRef} className="text-muted"><i>f</i>{this.state.aperture.toString()}, {this.state.shutterSpeed}s, {this.state.iso}iso</span>
        <button onClick={this.togglePopup.bind(this)}>show larger</button>
        {this.state.showPopup ?
          <PhotoPopup closePopup={this.togglePopup} imageUrl={this.props.imageUrl} />
          : null
        }
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="App">
        <PhotoForm />
        <br />
        {imgs.map((item, index) => 
          <Photo imageUrl={item} key={index} />
        )}
      </div>
    );
  }
}

export default App;
