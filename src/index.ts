import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
// import weekOfYear from "dayjs/plugin/weekOfYear";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

{
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(advancedFormat);
    // dayjs.extend(weekOfYear);
    dayjs.extend(relativeTime);
    dayjs.extend(customParseFormat);
    const tz = dayjs.tz.guess();
    const format = (year = false) => `h:mm A [on] dddd, MMMM Do${year ? " [in] YYYY" : ""}`;

    const $ = (id: string) => document.getElementById(id);

    const util = {
        removeAnimation(element: Element) {
            element.classList.remove("aos-animate");
            element.classList.remove("aos-init");
            for (let i = 0; i < element.children.length; i++) {
                const e = element.children.item(i) as Element;

                this.removeAnimation(e);
            }
        },
        current: dayjs().tz(tz),
    };

    const main = (wait: boolean = true) => {
        util.removeAnimation(document.getElementById("show-converted-timestamp")!);
        setTimeout(
            () => {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                document.getElementById("main")!.style.display = "block";
                document.getElementById("show-converted-timestamp")!.style.display = "none";
                for (let i = 0; i < document.getElementsByClassName("o").length; i++) {
                    const e = document.getElementsByClassName("o").item(i) as HTMLElement;

                    e.style.display = "none";
                }
                (window as any).AOS.refresh();
            },
            wait ? 800 : 0,
        );
    };

    const showConvertedTimestamp = (showOther: boolean, wait: boolean = true) => {
        util.removeAnimation(document.getElementById("main")!);
        setTimeout(
            () => {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                document.getElementById("main")!.style.display = "none";
                document.getElementById("show-converted-timestamp")!.style.display = "block";
                if (showOther) {
                    const section = document.getElementById("show-converted-timestamp-section");
                    section?.classList.remove("centered");
                    section?.classList.add("centered-horizontal");

                    for (let i = 0; i < document.getElementsByClassName("o").length; i++) {
                        const e = document.getElementsByClassName("o").item(i) as HTMLElement;

                        e.style.display = "block";
                    }
                } else {
                    const section = document.getElementById("show-converted-timestamp-section");
                    section?.classList.add("centered");
                    section?.classList.remove("centered-horizontal");

                    for (let i = 0; i < document.getElementsByClassName("o").length; i++) {
                        const e = document.getElementsByClassName("o").item(i) as HTMLElement;

                        e.style.display = "none";
                    }
                }
                (window as any).AOS.refresh();
            },
            wait ? 800 : 0,
        );
    };

    const tryToReadTimestamp = (timestamp: string, showOther: boolean) => {
        if (timestamp.length >= 0 && !isNaN(timestamp as unknown as number)) {
            let unixNum = Number.parseInt(timestamp);

            if (!isNaN(unixNum)) {
                if (unix.length === 13) {
                    // unix timestamp in millseconds
                    console.log("unix timestamp in millseconds: " + timestamp);
                    const date = dayjs(unixNum).tz(tz);
                    document.getElementById("output")!.innerHTML = date.format(
                        format(date.year() !== util.current.year()),
                    );
                    showConvertedTimestamp(showOther, false);
                } else if (unix.length === 10) {
                    // unix timestamp in seconds
                    console.log("unix timestamp in seconds: " + timestamp);
                    const date = dayjs.unix(unixNum).tz(tz);
                    document.getElementById("output")!.innerHTML = date.format(
                        format(date.year() !== util.current.year()),
                    );
                    // let relative = "in ";
                    // let relativeArr = [];

                    // const years = Math.abs(date.year() - util.current.year());
                    // if (years > 0) relativeArr.push(years + (years > 1 ? " years" : " year"));

                    // const weeks = Math.abs(date.week() - util.current.week());
                    // if (weeks > 0) relativeArr.push(weeks + (weeks > 1 ? " weeks" : " week"));

                    // const days = Math.abs(date.day() + 1 - (util.current.day() + 1));
                    // if (days > 0) relativeArr.push(days + (days > 1 ? " days" : " day"));

                    // const hours = Math.abs(date.hour() + 1 - (util.current.hour() + 1));
                    // if (hours > 0) relativeArr.push(hours + (hours > 1 ? " hours" : " hour"));

                    // const minutes = Math.abs(date.minute() + 1 - (util.current.minute() + 1));
                    // if (minutes > 0) relativeArr.push(minutes + (minutes > 1 ? " minutes" : " minute"));

                    // if (relativeArr.length <= 0) {
                    //     const seconds = Math.abs(date.second() + 1 - (util.current.second() + 1));
                    //     if (seconds > 0) relativeArr.push(seconds + (seconds > 1 ? " seconds" : " second"));
                    // }

                    // if (relativeArr.length > 1) relative += relativeArr.slice(0, -1).join(", ");
                    // else if (relativeArr.length > 0) relative += relativeArr[0];
                    // if (relativeArr.length > 1) relative += " and " + relativeArr[relativeArr.length - 1];

                    // if (relativeArr.length <= 0) {
                    //     relative = "in the past";
                    // }

                    document.getElementById("output-relative")!.innerHTML = date.fromNow();

                    showConvertedTimestamp(showOther, false);
                } else {
                    main(false);
                    return console.log("invalid unix timestamp: " + timestamp);
                }
            } else {
                main(false);
                return console.log("invalid unix timestamp: " + timestamp);
            }
        } else {
            main(false);
            return console.log("invalid unix timestamp: " + timestamp);
        }
    };

    let unix = window.location.pathname.trim().replace("/", "");
    const showOther = window.location.hash.includes("o") || false;
    tryToReadTimestamp(unix, showOther);

    window.addEventListener("load", () => {
        const date = $("date") as HTMLInputElement;
        const time = $("time") as HTMLInputElement;
        const output = $("output2") as HTMLInputElement;
        const share = $("share") as HTMLInputElement;

        // https://stackoverflow.com/a/48056895
        function resizable(el: any, factor: any) {
            var int = Number(factor) || 7.7;
            function resize() {
                el.style.width = (el.value.length + 1) * int + "px";
            }
            var e = "keyup,keypress,focus,blur,change,input".split(",");
            for (var i in e) el.addEventListener(e[i], resize, false);
            resize();
        }
        resizable(output, 7);
        resizable(share, 7);

        const update = () => {
            output.value = dayjs(date.value + " " + time.value, "YYYY-MM-DD hh:mm:ss")
                .unix()
                .toString();
            share.value = "https://timestamp.naturecodevoid.dev/" + output.value;
            const e = new Event("input", { bubbles: true });
            output.dispatchEvent(e);
            share.dispatchEvent(e);
        };

        date.value = util.current.format("YYYY-MM-DD");
        time.value = util.current.format("hh:mm:ss");

        update();

        $("date")?.addEventListener("input", update);
        $("time")?.addEventListener("input", update);
    });
}

export {};
