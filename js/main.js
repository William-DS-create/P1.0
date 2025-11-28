// Basic interactivity: theme toggle, project filter, contact form handling, animate skill bars
document.addEventListener("DOMContentLoaded", function () {
  // Year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const current = localStorage.getItem("ds_theme") || "light";
  if (current === "dark")
    document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("ds_theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("ds_theme", "dark");
    }
  });

  // Skill bars animation
  const skillSpans = document.querySelectorAll(".progress span");
  skillSpans.forEach((span) => {
    const val = span.dataset.value || 0;
    setTimeout(() => {
      span.style.width = val + "%";
    }, 300);
  });

  // Project filters
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      projects.forEach((p) => {
        if (f === "all") p.style.display = "";
        else {
          const tags = p.dataset.tags.split(" ");
          p.style.display = tags.includes(f) ? "" : "none";
        }
      });
    })
  );

  // Contact form handling (no backend) — show a friendly message
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      formMsg.textContent = "Please complete all fields.";
      return;
    }
    // Try Formspree if the action is set; otherwise show simulated message
    const action = form.getAttribute("action");
    if (action && action.includes("formspree.io")) {
      // Let the browser submit the form normally to Formspree
      form.submit();
    } else {
      formMsg.textContent =
        "Thanks! Your message looks good — replace the form `action` with your Formspree endpoint to send emails.";
      form.reset();
      setTimeout(() => {
        formMsg.textContent = "";
      }, 6000);
    }
  });
});

// Plotly demo: will run when Plotly is loaded
function renderPlotlyDemo() {
  if (typeof Plotly === "undefined") return;
  const chart = document.getElementById("chart");
  if (!chart) return;
  async function renderPlotlyDemo() {
    if (typeof Plotly === "undefined") return;
    const chart = document.getElementById("chart");
    if (!chart) return;

    // Try to load the local CSV dataset (assets/data/hiv_liberia.csv)
    try {
      const resp = await fetch("assets/data/hiv_liberia.csv");
      if (!resp.ok) throw new Error("CSV not found");
      const txt = await resp.text();
      const lines = txt.trim().split("\n");
      const header = lines
        .shift()
        .split(",")
        .map((h) => h.trim());
      const rows = lines.map((l) => l.split(",").map((v) => v.trim()));
      const years = rows.map((r) => r[0]);
      const newCases = rows.map((r) => Number(r[1]));
      const deaths = rows.map((r) => Number(r[2]));
      const prevalence = rows.map((r) => Number(r[3]));

      const traceCases = {
        x: years,
        y: newCases,
        type: "bar",
        name: "New Cases",
        marker: { color: "rgba(37,99,235,0.8)" },
      };
      const traceDeaths = {
        x: years,
        y: deaths,
        type: "scatter",
        mode: "lines+markers",
        name: "Deaths",
        marker: { color: "rgba(234,88,12,0.9)" },
      };
      const tracePrev = {
        x: years,
        y: prevalence,
        type: "scatter",
        mode: "lines+markers",
        name: "Prevalence (%)",
        yaxis: "y2",
        marker: { color: "rgba(96,165,250,0.9)" },
      };

      const layout = {
        title: "HIV / AIDS — Liberia (sample aggregated data)",
        margin: { t: 48 },
        yaxis: { title: "Count" },
        yaxis2: { title: "Prevalence (%)", overlaying: "y", side: "right" },
        legend: { orientation: "h", x: 0, y: 1.08 },
      };

      Plotly.newPlot(chart, [traceCases, traceDeaths, tracePrev], layout, {
        responsive: true,
      });
      return;
    } catch (err) {
      // Fallback to previous sample if CSV can't be loaded
      const trace1 = {
        x: ["Jan", "Feb", "Mar", "Apr", "May"],
        y: [20, 14, 23, 25, 22],
        type: "scatter",
        mode: "lines+markers",
        name: "Series A",
      };
      const trace2 = {
        x: ["Jan", "Feb", "Mar", "Apr", "May"],
        y: [12, 18, 15, 19, 16],
        type: "bar",
        name: "Series B",
        opacity: 0.6,
      };
      const layout = { title: "Sample Data Science Demo", margin: { t: 40 } };
      Plotly.newPlot(chart, [trace1, trace2], layout, { responsive: true });
      return;
    }
  }
}

// Try to render when DOM ready; if Plotly loads later, render on window load too
document.addEventListener("DOMContentLoaded", renderPlotlyDemo);
window.addEventListener("load", renderPlotlyDemo);
