export default function returnRandomUserColor() {
    const colors = ['#0038FF', '#00BEE8', '#1FD7C1', '#6E52FF', '#9327FF', '#9747FF', '#C3FF2B', '#FC71FF', '#FF4646', '#FF5EB3', '#FF745E']
    return colors[Math.floor(Math.random() * colors.length)]
}