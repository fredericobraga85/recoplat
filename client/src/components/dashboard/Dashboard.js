import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProfile } from '../../actions/profileActions'
import PropTypes from 'prop-types'
import Spinner from '../common/Spinner'
import { Link } from 'react-router-dom'

class Dashboard extends Component {
  componentDidMount() {
    this.props.getProfile()
  }
  render() {
    const { user } = this.props.auth
    const { profile, loading } = this.props.profile

    let dashboardContent

    if (profile === null || loading) {
      dashboardContent = <Spinner />
    } else {
      if (Object.keys(profile).length > 0) {
        dashboardContent = <h4> TBD Displays dashboard</h4>
      } else {
        dashboardContent = (
          <div>
            <p className="load text-muted">Welcome {user.name} !</p>
            <p>You have not yet setup a profile, please add some info.</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        )
      }
    }

    return (
      <div>
        <h2>Dashboard!</h2>
        <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-12">{dashboardContent}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { getProfile }
)(Dashboard)
