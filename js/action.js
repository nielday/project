(() => {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                // form.classList.add("was-validated");
            },
            false
        );
    });
})();

$(document).ready(function () {
    $("#button-confirm-username").click(function () {
        if ($("#validationCustom01").val().length < 1) {
            $("#validationCustom01").addClass("was-invalid ");
            $("#showUserError").removeClass("d-none");
        } else {
            $("#form-username").addClass("d-none");
            $("#form-password").removeClass("d-none");
        }
    });
    $("#validationCustom01").on("input", function (event) {
        if ($("#validationCustom01").val().length > 0) {
            $("#validationCustom01").removeClass("was-invalid ");
            $("#showUserError").addClass("d-none");
        }
    });

    $("#button-confirm-password").click(function (e) {
        if ($("#validationCustom02").val().length < 1) {
            e.preventDefault();
            $("#validationCustom02").addClass("was-invalid ");
            $("#showPassError").removeClass("d-none");
        }
    });

    $("#validationCustom02").on("input", function (event) {
        if ($("#validationCustom02").val().length > 0) {
            $("#validationCustom02").removeClass("was-invalid ");
            $("#showPassError").addClass("d-none");
        }
    });

    $("#eye-show").click(() => {
        $("#validationCustom02").attr("type", "text");
        $("#eye-show").addClass("d-none");
        $("#eye-hide").removeClass("d-none");
    });
    $("#eye-hide").click(() => {
        $("#validationCustom02").attr("type", "password");
        $("#eye-show").removeClass("d-none");
        $("#eye-hide").addClass("d-none");
    });

    let curr_track = document.createElement("audio");
    let updateTimer;
    let currentid;
    let isPlaying = false;

    $(".song-item").click((event) => {
        var parentElement = $(event.target).closest(".song-item");
        var id = parentElement.attr("idsong");
        currentid = id;
        loadTrack(id);
        $(".play-music").removeClass("d-none");
    });

    const loadTrack = (id) => {
        clearInterval(updateTimer);
        reset();

        pauseTrack();
        var item = topSongs.filter((a) => a.id == id)[0];
        console.log(topSongs.filter((a) => a.id == id));
        console.log(id);
        curr_track.src = "../audio/" + item.audio;
        $(".image-song").attr("src", "../images/" + item.image);
        $(".name-song").html(item.title);
        $(".author-song").html(item.author);
        curr_track.load();

        updateTimer = setInterval(setUpdate, 1000);
        playTrack();
        curr_track.addEventListener("ended", nextTrack);
    };

    const reset = () => {
        $(".current-time").html("00:00");
        $(".total-duration").html("00:00");
        $(".seek_slider").val(0);
    };

    const setUpdate = () => {
        let seekPosition = 0;
        if (!isNaN(curr_track.duration)) {
            seekPosition = curr_track.currentTime * (100 / curr_track.duration);
            $(".seek_slider").val(seekPosition);

            let currentMinutes = Math.floor(curr_track.currentTime / 60);
            let currentSeconds = Math.floor(
                curr_track.currentTime - currentMinutes * 60
            );
            let durationMinutes = Math.floor(curr_track.duration / 60);
            let durationSeconds = Math.floor(
                curr_track.duration - durationMinutes * 60
            );

            if (currentSeconds < 10) {
                currentSeconds = "0" + currentSeconds;
            }
            if (durationSeconds < 10) {
                durationSeconds = "0" + durationSeconds;
            }
            if (currentMinutes < 10) {
                currentMinutes = "0" + currentMinutes;
            }
            if (durationMinutes < 10) {
                durationMinutes = "0" + durationMinutes;
            }
            $(".current-time").html(currentMinutes + ":" + currentSeconds);
            $(".total-duration").html(durationMinutes + ":" + durationSeconds);
        }
    };

    const seekTo = () => {
        let seekto = curr_track.duration * ($(".seek_slider").val() / 100);
        curr_track.currentTime = seekto;
    };
    $(".seek_slider").change(() => {
        seekTo();
    });

    const playTrack = () => {
        curr_track.play();
        isPlaying = true;
        $(".play-song").addClass("d-none");
        $(".pause-song").removeClass("d-none");
    };
    const pauseTrack = () => {
        curr_track.pause();
        isPlaying = false;
        $(".play-song").removeClass("d-none");
        $(".pause-song").addClass("d-none");
    };
    const playpauseTrack = () => {
        isPlaying ? pauseTrack() : playTrack();
    };
    $(".playpause-track").click(() => {
        playpauseTrack();
    });

    $(".repeat-track").click(() => {
        loadTrack(currentid);
    });

    $(".volume_slider").change(() => {
        curr_track.volume = $(".volume_slider").val() / 100;
    });
    const nextTrack = () => {
        if (currentid) {
            var nextId = topSongs.filter((item) => item.id > currentid);
            if (nextId.length > 0) {
                currentid = nextId[0].id;
            } else {
                currentid = "1";
            }
            loadTrack(currentid);
        } else {
            loadTrack("1");
            currentid = "1";
        }
    };
    $(".next-track").click(() => {
        if (currentid) {
            var nextId = topSongs.filter((item) => item.id > currentid);
            if (nextId.length > 0) {
                currentid = nextId[0].id;
            } else {
                currentid = "1";
            }
            loadTrack(currentid);
        } else {
            loadTrack("1");
            currentid = "1";
        }
    });

    $(".prev-track").click(() => {
        if (currentid) {
            var nextId = topSongs.filter((item) => item.id < currentid);
            if (nextId.length > 0) {
                currentid = nextId[nextId.length - 1].id;
            } else {
                currentid = topSongs[topSongs.length - 1].id;
            }
            loadTrack(currentid);
        } else {
            currentid = topSongs[topSongs.length - 1].id;
            loadTrack(currentid);
        }
    });

    $(".random-track").click(() => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
        Toast.fire({
            icon: "success",
            title: "Add to favorite  successfully",
        });
    });
    albums.map((item) => {
        $(".album")
            .append(` <div id="${item.id}" class="col-lg-3 col-6 col-sm-4 col-md-3 my-2 pointer song-album">
        <div class="card card__items card-main" style="background-color: black !important; border: none; height:350px">
            <img  src="../images/${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title text-light">${item.title}</h5>
                <p class="card-text" style="color: gray;">${item.sub_title}</p>
            </div>
        </div>
    </div>`);
    });

    topAlbums.map((item) => {
        $(".top-ablum")
            .append(` <div id="${item.id}" class="col-lg-3 col-6 col-sm-4 col-md-3 my-2 pointer song-album">
        <div class="card card__items card-main" style="background-color: black !important; border: none; height:350px">
            <img  src="../images/${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title text-light">${item.title}</h5>
                <p class="card-text" style="color: gray;">${item.sub_title}</p>
            </div>
        </div>
    </div>`);
    });

    $(".song-album").click((event) => {
        var parentElement = $(event.target).closest(".song-album");
        var id = parentElement.attr("id");
        localStorage.setItem("albumId", id);
        window.location.href = "albumDetail.html";
    });
    artists.map((item) => {
        $(".artirst")
            .append(`  <div class="col-lg-3 col-6 col-sm-4 col-md-3 my-2 pointer">
        <div class="card card__items card-main" style="background-color: black !important; border: none ; height:350px">
            <img src="../images/${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title text-light">${item.title}</h5>
                <p class="card-text" style="color: gray;">${item.sub_title}</p>
            </div>
        </div>
    </div>`);
    });
    let songFilter = [];
    $(".form-search").change(() => {
        console.log($(".form-search").val());
        var value = $(".form-search").val();
        songFilter = topSongs.filter((item) =>
            item.title.toLowerCase().includes(value.toLowerCase())
        );
        if (songFilter.length > 0) {
            $(".body-playlist").html("");

            songFilter.map((item) => {
                let track = document.createElement("audio");
                track.src = "../audio/" + item.audio;

                let duration;
                track.addEventListener("loadedmetadata", () => {
                    duration = track.duration;
                    addItem(item, duration, track);
                });
            });
        } else {
            $(".body-playlist").html("");
        }
    });
    if (songFilter.length == 0) {
        topSongs.map((item) => {
            let track = document.createElement("audio");
            track.src = "../audio/" + item.audio;

            let duration;
            track.addEventListener("loadedmetadata", () => {
                duration = track.duration;
                addItem(item, duration, track);
            });
        });
    }

    const addItem = (item, duration, track) => {
        if (duration) {
            let seekPosition = track.currentTime * (100 / duration);
            $(".seek_slider").val(seekPosition);

            let durationMinutes = Math.floor(duration / 60);
            let durationSeconds = Math.floor(duration - durationMinutes * 60);

            if (durationSeconds < 10) {
                durationSeconds = "0" + durationSeconds;
            }
            if (durationMinutes < 10) {
                durationMinutes = "0" + durationMinutes;
            }

            duration = durationMinutes + ":" + durationSeconds;
            console.log(duration);
        }
        $(".body-playlist")
            .append(`  <tr class='pointer playlist-song' id="${item.id} ">
        <td>
            <img src="../images/${item.image}"
                    alt="" width="50" height="50" style="border-radius: 6px; object-fit:cover ">
                <span class='ms-2'>${item.title}</span> 

        </td>
        <td>Chemical Reaction</td>
        <td class="duration">${duration}</td>
        <td><i class="fa fa-heart" style="color: red; font-size: 24px;"></i></td>
   
    </tr>`);
    };

    $(".body-playlist").on("click", ".playlist-song", (event) => {
        var parentElement = $(event.target).closest(".playlist-song");
        var id = parentElement.attr("id");
        loadTrack(id);
        $(".play-music").removeClass("d-none");
    });
    var ablumItem = allAlbums.filter(
        (item) => item.id == localStorage.getItem("albumId")
    )[0];
    console.log(localStorage.getItem("albumId"), ablumItem);
    $(".image-album-detail").attr("src", "../images/" + ablumItem.image);
    $(".title-album-detail").html(ablumItem.title);
    $(".date-album").html(ablumItem.date);
    $(".people-name").html(ablumItem.creator);
    $(".like").html(ablumItem.like + " like");
    $(".image-artist").attr("src", "../images/" + ablumItem.imageArtist);
    $(".artist-name").html(ablumItem.artists_name);

    $(".btn-play").click(() => {
        if (currentid) {
            playpauseTrack();
        } else {
            currentid = "1";
            $(".play-music").removeClass("d-none");
            loadTrack(currentid);
        }
    });

    $(".isLogout").click((e) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "index.html";
            }
        });
    });
});
import { topSongs, albums, artists, topAlbums, allAlbums } from "../js/data.js";

document.addEventListener("DOMContentLoaded", function () {
    var ulElement = document.getElementById("top-songs-list");
    if (!ulElement) {
        ulElement = document.createElement("ul");
    }
    topSongs.forEach((item) => {
        var liElement = document.createElement("li");
        var aElement = document.createElement("div");
        var imgElement = document.createElement("img");
        var spanSong = document.createElement("span");
        aElement.setAttribute("idsong", item.id);
        aElement.classList.add("song-item");
        imgElement.src = "../images/" + item.image;
        imgElement.style.objectFit = "cover";
        imgElement.alt = "";
        imgElement.width = 40;
        spanSong.textContent = item.author + " - " + item.title;
        aElement.appendChild(imgElement);
        aElement.appendChild(spanSong);

        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    });
});

document.getElementById("confirmLogout").addEventListener("click", function () {
    // Điều hướng ngược lại nếu người dùng đồng ý
    window.location.href = "./index.html";
});

document.getElementById("cancelLogout").addEventListener("click", function () {
    // Tắt popup nếu người dùng hủy bỏ
    document.getElementById("logoutPopup").style.display = "none";
});

//
function changeColorLike() {
    var heartIcon = document.getElementById("like");
    if (heartIcon.style.color === "red") {
        heartIcon.style.color = "#fcfcfc";
    } else {
        heartIcon.style.color = "red";
    }
}
