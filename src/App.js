import React, { Component } from 'react';
import EXIF from 'exif-js'
import './App.css';

var imgs = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"]

class PhotoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log('form submitted.')
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <label>
            File(s): 
            <input type="file" multiple value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      )
  }
}

class Photo extends Component {
  constructor(props) {
    super(props)

    this.imgRef = React.createRef()
    this.descRef = React.createRef()

    this.handleOnLoad = this.handleOnLoad.bind(this)


    this.state = {
      aperture: 0,
      shutterSpeed: 0.0,
      iso: 0.0,
    }
  }

  handleOnLoad() {

  }

  componentDidMount() {
    const img = this.imgRef.current
    const desc = this.descRef.current

    EXIF.getData(img, function() {
      console.log(JSON.stringify(EXIF.getAllTags(this), null, '\t'))
      var aperture = EXIF.getTag(this, 'FNumber')
      var shutterSpeed = EXIF.getTag(this, 'ShutterSpeedValue')
      var sens = EXIF.getTag(this, 'ISOSpeedRatings')
    })

    this.setState({aperture: 4, shutterSpeed: 0.1, iso: 100})
  }

  render() {
    return (
      <div>
        <img onLoad={this.handleOnLoad} ref={this.imgRef} src={this.props.imageUrl} style={{width: 400}} />
        <span ref={this.descRef} className="text-muted"><i>f</i>{this.state.aperture}, {this.state.shutterSpeed}s, {this.state.iso}iso</span>
      </div>
    )
  }
}

class App extends Component {
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
