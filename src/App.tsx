import { useState, useEffect } from "react";
import {
  CITIES,
  fetchWeatherData,
  getWeatherInfo,
  formatTemperature,
  formatWeekday,
  formatDate,
  formatDateTime,
  removeAccents,
  getFavoriteCityIds,
  saveFavoriteCityIds,
} from "./api/weather";
import type { City, WeatherApiResponse, TemperatureUnit } from "./types";

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteCityIds());

  // Tải dữ liệu thời tiết khi chọn thành phố
  async function loadWeather(city: City) {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(data);
    } catch (err) {
      setError((err as Error).message || "Không thể tải dữ liệu thời tiết");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectCity(city: City) {
    setSelectedCity(city);
    loadWeather(city);
  }

  function handleRetry() {
    if (selectedCity) {
      loadWeather(selectedCity);
    }
  }

  // Chức năng nâng cao: Ghim / bỏ ghim thành phố yêu thích vào localStorage
  function handleToggleFavorite(e: React.MouseEvent, cityId: string) {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const isFav = prev.includes(cityId);
      const next = isFav ? prev.filter((id) => id !== cityId) : [...prev, cityId];
      saveFavoriteCityIds(next);
      return next;
    });
  }

  // Chức năng nâng cao: Tự động đổi màu nền theo thời tiết hiện tại
  useEffect(() => {
    document.body.className = "";
    if (weatherData) {
      const info = getWeatherInfo(weatherData.current.weather_code);
      document.body.classList.add(`theme-${info.theme}`);
    }
    return () => {
      document.body.className = "";
    };
  }, [weatherData]);

  // Chức năng nâng cao: Lọc thành phố không phân biệt hoa thường và dấu tiếng Việt
  const filteredCities = CITIES.filter((c) =>
    removeAccents(c.name).includes(removeAccents(searchQuery)),
  );

  // Sắp xếp đưa các thành phố yêu thích lên trước
  const sortedCities = [...filteredCities].sort((a, b) => {
    const aFav = favoriteIds.includes(a.id) ? 1 : 0;
    const bFav = favoriteIds.includes(b.id) ? 1 : 0;
    return bFav - aFav;
  });

  const currentWeatherInfo = weatherData
    ? getWeatherInfo(weatherData.current.weather_code)
    : null;

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo-box">
            <h1>
              Thời Tiết <span>Việt Nam</span>
            </h1>
            <div className="student-tag">
              Bài TH02 &bull; Sinh viên: <b>Nguyễn Quốc Bảo</b> (B25DCCC037)
            </div>
          </div>

          {/* YC5: Đổi °C / °F, không gọi lại API */}
          <div className="unit-toggle" title="Chuyển đổi đơn vị nhiệt độ">
            <button
              className={`unit-btn ${unit === "C" ? "active" : ""}`}
              onClick={() => setUnit("C")}
            >
              °C
            </button>
            <button
              className={`unit-btn ${unit === "F" ? "active" : ""}`}
              onClick={() => setUnit("F")}
            >
              °F
            </button>
          </div>
        </div>
      </header>

      <main className="main-wrapper">
        <div className="weather-layout">
          {/* CỘT TRÁI: DANH SÁCH 8 THÀNH PHỐ */}
          <aside className="sidebar-panel">
            <div className="sidebar-title">
              <span>Danh sách 8 thành phố</span>
              <span className="student-tag">({filteredCities.length}/8)</span>
            </div>

            {/* Nâng cao: Tìm kiếm không phân biệt dấu */}
            <div className="city-search-box">
              <input
                type="text"
                placeholder="Tìm thành phố (ví dụ: da nang, hà nội)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {sortedCities.length === 0 ? (
              <p className="state-desc" style={{ padding: "16px 0" }}>
                Không tìm thấy thành phố nào phù hợp.
              </p>
            ) : (
              <ul className="city-list">
                {sortedCities.map((city) => {
                  const isSelected = selectedCity?.id === city.id;
                  const isFavorite = favoriteIds.includes(city.id);

                  return (
                    <li
                      key={city.id}
                      className={`city-item ${isSelected ? "active" : ""}`}
                      onClick={() => handleSelectCity(city)}
                    >
                      <div className="city-info-left">
                        <button
                          className={`btn-star ${isFavorite ? "favorited" : ""}`}
                          title={isFavorite ? "Bỏ yêu thích" : "Đánh dấu yêu thích"}
                          onClick={(e) => handleToggleFavorite(e, city.id)}
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>
                        <span className="city-name">{city.name}</span>
                      </div>
                      {isSelected && <span style={{ fontSize: "13px" }}>● Đang xem</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* CỘT PHẢI: CHI TIẾT THỜI TIẾT & DỰ BÁO 7 NGÀY */}
          <section className="detail-panel">
            {/* YC4: Trạng thái CHƯA CHỌN THÀNH PHỐ */}
            {!selectedCity && !loading && !error && (
              <div className="state-box">
                <div className="state-icon">👈</div>
                <div className="state-title">Chưa chọn thành phố</div>
                <div className="state-desc">
                  Vui lòng bấm chọn một thành phố từ danh sách bên trái để xem thông tin thời tiết
                  hiện tại và dự báo 7 ngày.
                </div>
              </div>
            )}

            {/* YC4: Trạng thái ĐANG TẢI (LOADING) */}
            {loading && (
              <div className="state-box">
                <div className="state-icon">⏳</div>
                <div className="state-title">Đang tải dữ liệu thời tiết…</div>
                <div className="state-desc">
                  Đang lấy dữ liệu khí tượng cho {selectedCity?.name} từ Open-Meteo API.
                </div>
              </div>
            )}

            {/* YC4: Trạng thái BÁO LỖI (ERROR) CÓ NÚT THỬ LẠI */}
            {error && !loading && (
              <div className="state-box error">
                <div className="state-icon">⚠️</div>
                <div className="state-title" style={{ color: "var(--danger)" }}>
                  Có lỗi xảy ra khi tải dữ liệu
                </div>
                <div className="state-desc">{error}</div>
                <button className="btn-retry" onClick={handleRetry}>
                  Thử lại
                </button>
              </div>
            )}

            {/* YC2 & YC3: HIỂN THỊ DỮ LIỆU KHI TẢI THÀNH CÔNG */}
            {weatherData && selectedCity && !loading && !error && currentWeatherInfo && (
              <>
                {/* YC2: Thời tiết hiện tại */}
                <article className="current-weather-card">
                  <div className="current-header">
                    <h2 className="current-city-title">{selectedCity.name}</h2>
                    <div className="current-update-time">
                      Cập nhật: {formatDateTime(weatherData.current.time)}
                    </div>
                  </div>

                  <div className="current-main">
                    <div className="current-icon">{currentWeatherInfo.icon}</div>
                    <div>
                      <div className="current-temp">
                        {formatTemperature(weatherData.current.temperature_2m, unit)}
                      </div>
                      <div className="current-desc">{currentWeatherInfo.description}</div>
                    </div>
                  </div>

                  {/* 3 Thông số: Độ ẩm, Tốc độ gió, Thời điểm cập nhật */}
                  <div className="weather-metrics">
                    <div className="metric-item">
                      <div className="metric-label">Độ ẩm tương đối</div>
                      <div className="metric-value">
                        {weatherData.current.relative_humidity_2m}%
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-label">Tốc độ gió</div>
                      <div className="metric-value">
                        {weatherData.current.wind_speed_10m} km/h
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-label">Mã thời tiết (WMO)</div>
                      <div className="metric-value">
                        #{weatherData.current.weather_code}
                      </div>
                    </div>
                  </div>
                </article>

                {/* YC3: Dự báo thời tiết 7 ngày */}
                <section className="forecast-section">
                  <h3 className="forecast-title">Dự báo 7 ngày tới</h3>
                  <div className="forecast-grid">
                    {weatherData.daily.time.map((dateStr, idx) => {
                      const code = weatherData.daily.weather_code[idx];
                      const dayInfo = getWeatherInfo(code);
                      const maxTemp = weatherData.daily.temperature_2m_max[idx];
                      const minTemp = weatherData.daily.temperature_2m_min[idx];
                      const isToday = idx === 0;

                      return (
                        <div
                          key={dateStr}
                          className={`forecast-card ${isToday ? "today" : ""}`}
                        >
                          <div className="forecast-weekday">
                            {formatWeekday(dateStr, idx)}
                          </div>
                          <div className="forecast-date">{formatDate(dateStr)}</div>
                          <div className="forecast-icon">{dayInfo.icon}</div>
                          <div className="forecast-desc" title={dayInfo.description}>
                            {dayInfo.description}
                          </div>
                          <div className="forecast-temps">
                            <span className="temp-max" title="Nhiệt độ cao nhất">
                              {formatTemperature(maxTemp, unit)}
                            </span>
                            <span className="temp-min" title="Nhiệt độ thấp nhất">
                              {formatTemperature(minTemp, unit)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        Bài tập thực hành 02 (TH01) &bull; Học viện Công nghệ Bưu chính Viễn thông (PTIT) &bull; Dữ
        liệu từ Open-Meteo API
      </footer>
    </>
  );
}

