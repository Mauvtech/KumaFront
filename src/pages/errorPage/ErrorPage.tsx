export default function ErrorPage({error}: { error: Error }) {

    console.log(error)

    return (
        <div>
            <h1>ErrorPage</h1>
        </div>
    )
}