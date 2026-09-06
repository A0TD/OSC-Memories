import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; 
import styles from './EverySeason.module.css';
import image from '../../assets/img/Seasons_Photo.jpg'

export default function EverySeason() {
  return (
    <>
    <div className="text-light min-vh-100">
        <div className={`${styles.heroSection} d-flex align-items-center`}>
          <div className="container">
            <h1 className={`fw-bold display-4 ${styles.seasonsHeading}`}>Seasons</h1>
            <p className="lead md-w-50 fw-medium">
              Explore all OSC seasons and relive the journey through our events,
              memories, and achievements.
            </p>
          </div>
        </div>
        <div className={styles.allCards}>
          <div className={`container ${styles.allCards}`}>
            <div className="row g-4 py-5">
              <div className="col-12 col-md-6 col-lg-4">
                <Link className="text-decoration-none">
                  <div
                    className={`card text-light border-secondary h-100 ${styles.seasonCard}`}
                  >
                    <img
                      src={image}
                      alt="photo"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title fw-bold ${styles.text}`}>
                        Season{" "}
                      </h5>
                      <p className={`card-text small mb-4 ${styles.text}`}>
                        Amazing season
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <div
                          className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Link className="text-decoration-none">
                  <div
                    className={`card text-light border-secondary h-100 ${styles.seasonCard}`}
                  >
                    <img
                      src={image}
                      alt="photo"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title fw-bold ${styles.text}`}>
                        Season{" "}
                      </h5>
                      <p className={`card-text small mb-4 ${styles.text}`}>
                        Amazing season
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <div
                          className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Link className="text-decoration-none">
                  <div
                    className={`card text-light border-secondary h-100 ${styles.seasonCard}`}
                  >
                    <img
                      src={image}
                      alt="photo"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title fw-bold ${styles.text}`}>
                        Season{" "}
                      </h5>
                      <p className={`card-text small mb-4 ${styles.text}`}>
                        Amazing season
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <div
                          className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Link className="text-decoration-none">
                  <div
                    className={`card text-light border-secondary h-100 ${styles.seasonCard}`}
                  >
                    <img
                      src={image}
                      alt="photo"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title fw-bold ${styles.text}`}>
                        Season{" "}
                      </h5>
                      <p className={`card-text small mb-4 ${styles.text}`}>
                        Amazing season
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <div
                          className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Link className="text-decoration-none">
                  <div
                    className={`card text-light border-secondary h-100 ${styles.seasonCard}`}
                  >
                    <img
                      src={image}
                      alt="photo"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title fw-bold ${styles.text}`}>
                        Season{" "}
                      </h5>
                      <p className={`card-text small mb-4 ${styles.text}`}>
                        Amazing season
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <div
                          className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <Link className="text-decoration-none">
                  <div
                    className={`card text-light border-secondary h-100 ${styles.seasonCard}`}
                  >
                    <img
                      src={image}
                      alt="photo"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className={`card-title fw-bold ${styles.text}`}>
                        Season{" "}
                      </h5>
                      <p className={`card-text small mb-4 ${styles.text}`}>
                        Amazing season
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <div
                          className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
