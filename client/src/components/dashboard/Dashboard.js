import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProfile } from '../../actions/profileActions'
import PropTypes from 'prop-types'

class Dashboard extends Component {
  componentDidMount() {
    this.props.getProfile()
  }

  render() {
    return (
      <div>
        <h2>Dashboard!</h2>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired
}

export default connect(
  null,
  { getProfile }
)(Dashboard)
