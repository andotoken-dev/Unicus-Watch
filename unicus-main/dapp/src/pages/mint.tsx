import NFTCreateForm from "@/components/Form/NFTCreateForm";
import Layout from "@/components/Layout";

const MintPage = () => {
  return (
    <Layout>
      <h1 className="text-center text-3xl font-light tracking-wide">
        Unicus Watch Minting Platform
      </h1>
      <h2 className="pt-8 pb-12 text-center text-2xl font-light tracking-wide">
        Mint your NFT
      </h2>
      {/* Card Container*/}
      <div className="flex flex-col items-center justify-center">
        {/* Card */}
        <div className="flex min-h-[600px] w-[80%] max-w-[400px] flex-col items-center rounded-2xl bg-dark px-8 py-10 shadow-xl md:px-12">
          <NFTCreateForm />
        </div>
      </div>
    </Layout>
  );
};

export default MintPage;
