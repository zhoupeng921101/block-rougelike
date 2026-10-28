// [本工程修补] 去掉 GrabPass，改用固定功能加色混合。
// 原版靠 GrabPass 抓屏再 grab + color 来模拟叠加，GrabPass 是内置管线的东西，
// 本工程是 URP，控制台会刷
//   ShaderLab::GrabPasses::ApplyGrabPassMainThread can't be called from a job thread!
// 而且 SRP 下抓到的屏幕内容不保证是当前帧的正确 dst，结果本身也不可信。
//
// 原版数学展开后恰好等价于普通加色混合（c = tex * vertexColor）：
//   片元 result.rgb = grab + c.rgb，result.a = c.a
//   Blend SrcAlpha OneMinusSrcAlpha
//   => dst*(1-a) + (dst + c.rgb)*a = dst + c.rgb * c.a
//   这正是 Blend SrcAlpha One 的结果。
// 所以去掉 GrabPass 不改变画面，只是把它从「抓屏模拟」换成真正的硬件加色混合。
// 直通 alpha 也无需在片元里补乘：SrcAlpha 因子已经把 a=0 的透明边距乘没了。
// Block 素材包 1454 个非 normal 插槽全部是 add，原版这个 shader 也只实现了 Add 一种。
// 移植自示例工程 E:\AniRes\UnityFx。升级 DragonBones 时须重打此补丁。
Shader "DragonBones/BlendModes/Grab"
{
	Properties
	{
		[PerRendererData] 
		_MainTex ("Sprite Texture", 2D) = "white" {}
		_Color ("Tint", Color) = (1,1,1,1)
	}

	SubShader
	{
		Tags
		{ 
			"Queue" = "Transparent" 
			"IgnoreProjector" = "True" 
			"RenderType" = "Transparent" 
			"PreviewType" = "Plane"
			"CanUseSpriteAtlas" = "True"
		}

		Cull Off
		Lighting Off
		ZWrite Off
		Fog { Mode Off }
		Blend SrcAlpha One

		Pass
		{
			CGPROGRAM
			
			#include "UnityCG.cginc"

			#pragma target 3.0
			#pragma vertex vert
			#pragma fragment frag
			
			sampler2D _MainTex;
			fixed4 _Color;
			
			struct input
			{
				float4 vertex : POSITION;
				float4 color : COLOR;
				float2 texcoord : TEXCOORD0;
			};

			struct output
			{
				float4 vertex : SV_POSITION;
				fixed4 color : COLOR;
				half2 texcoord : TEXCOORD0;
			};
			
			output vert(input vi)
			{
				output vo;

				vo.vertex = UnityObjectToClipPos(vi.vertex);
				vo.texcoord = vi.texcoord;
				vo.color = vi.color * _Color;

				return vo;
			}
			
			fixed4 frag(output vo) : SV_Target
			{
				return tex2D(_MainTex, vo.texcoord) * vo.color;
			}
			
			ENDCG
		}
	}
	
	Fallback "Sprites/Default"
}
